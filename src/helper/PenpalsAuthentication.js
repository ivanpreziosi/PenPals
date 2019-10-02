
exports.checkAuth = async function (request, userRepository) {

	const User = require("../entity/User");
	var userRepository = userRepository;

	let hUsername = request.header('username');
	let hToken = request.header(require('../app_config').appTokenName);

	var userToCheck = await userRepository.findOne({
		select: ['username','id','session_token','session_create_time'],
		where: {username: hUsername}
	});
	console.log(userToCheck);
	var controlToken = userToCheck.CreateControlToken();
	console.log('CHECK-AUTH');

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

		throw new Error("Token formally invalid");
	}

	//controllo scadenza
	console.log('expiration-check');
	if(!userRepository.checkTokenExpiration(userToCheck)){
		console.log('EXPIRED-TOKEN');
		//azzero il token per sicurezza
		userRepository.findByUsername(hUsername).then(function (userToUpdate) {
			if (userToUpdate !== undefined) {
				var updatedUser = userRepository.deleteAuthToken(userToUpdate);
			}
		}, function (err) {
			console.log(err);
		});

		throw new Error("Token expired!");
	}

	return '{}';
	
};

exports.unauthorizedResponse = require('../tpl/UnauthorizedResponse');