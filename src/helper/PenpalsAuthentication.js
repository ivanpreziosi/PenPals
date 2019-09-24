
exports.checkAuth = async function (request,userRepository) {
	
	const Hasher = require("md5-typescript");
	const Repository = require("typeorm");
	const User= require("../entity/User");
	var userRepository = userRepository;	  
	var AppConfig = require('../app_config');
	  
	let hUsername = request.header('username');
	let hToken = request.header(require('../app_config').appTokenName);
	let hIp = request.connection.remoteAddress;
	let controlToken = Hasher.Md5.init(hUsername+hIp+AppConfig.appTokenSalt);
	 console.log('CHECK-AUTH');

	  //controllo formale
	  if(hToken == '' || hToken !== controlToken){
		//hToken formalmente non valido
		  console.log('MALFORMED-TOKEN');
		//azzero il token per sicurezza
		var userToUpdate = await userRepository.findByUsername(hUsername).then(function(userToUpdate){
			userToUpdate.session_token = null;
			userToUpdate.session_create_time = null;
			userRepository.save(userToUpdate).then(user => console.log(user));
			console.log('saved');
		}, function(err) {
			console.log(err);
		});		
	  
	  	throw new Error("Token formally invalid");
	  }

	  //controllo record
	  var result = await userRepository.find({
			username: hUsername,
			session_token: controlToken
	  });
	  
	  //controllo scadenza token

	  if(result.length != 1){
	  	//non esiste questo utente		
	  	throw new Error("Non existent user");
	  }
		
	  var authResult = JSON.stringify(result[0]);
	  //console.log(authResult);
	  return authResult;
		


};

exports.unauthorizedResponse = require('../tpl/UnauthorizedResponse');