
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


	  //controllo formale
	  if(hToken !== controlToken){
	  //hToken formalmente non valido
	  
	  //azzero il token per sicurezza
	  
	  	throw new Error("Token formally invalid");
	  }

	  //controllo record
	  var result = await userRepository.find({
			usernamae: hUsername,
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

exports.unauthorizedResponse = require('./UnauthorizedResponse');