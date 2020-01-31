
import { UserRepository } from "../repository/UserRepository";
import { getCustomRepository } from "typeorm";

exports.checkAuth = async function (request, response, next) {

	if (request.path == '/users/login' || (request.path == '/users' && request.method == 'POST')) {
		console.log("Public");
		next();
	} else {

		console.log("Private");
		let authenticated = true;

		var userRepository = getCustomRepository(UserRepository);

		let hUsername = request.header('username');
		let hToken = request.header(require('../app_config').appTokenName);

		var userToCheck = await userRepository.findOne({
			select: ['username', 'id', 'sessionToken', 'sessionCreateTime'],
			where: { username: hUsername }
		});

		var controlToken = userRepository.CreateControlToken(request, userToCheck);

		//controllo formale
		console.log('formal-check');
		if (hToken == '' || hToken !== controlToken) {
			//hToken formalmente non valido
			console.log('MALFORMED-TOKEN: ht' + hToken + "  ct" + controlToken);
			//azzero il token per sicurezza
			userRepository.findByUsername(hUsername).then(function (userToUpdate) {
				if (userToUpdate !== undefined) {
					var updatedUser = userRepository.deleteAuthToken(userToUpdate);
				}
			}, function (err) {
				console.log(err);
			});

			authenticated = false;
			//throw new Error("Token formally invalid");
			response.json(require('../tpl/UnauthorizedResponse'));
		}

		//controllo scadenza
		console.log('expiration-check');
		if (!userRepository.checkTokenExpiration(userToCheck)) {
			console.log('EXPIRED-TOKEN');
			//azzero il token per sicurezza
			userRepository.findByUsername(hUsername).then(function (userToUpdate) {
				if (userToUpdate !== undefined) {
					var updatedUser = userRepository.deleteAuthToken(userToUpdate);
				}
			}, function (err) {
				console.log(err);
			});
			authenticated = false;
			//throw new Error("Token expired!");
			response.json(require('../tpl/UnauthorizedResponse'));
		}

		if (authenticated) {
			next();
		}
	}

};

exports.unauthorizedResponse = require('../tpl/UnauthorizedResponse');