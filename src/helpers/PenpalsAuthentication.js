
exports.checkAuth = async function (request,userRepository) {
	
	  const Hasher = require("md5-typescript");
	  const Repository = require("typeorm");
	  const User= require("../entity/User");
	  var userRepository = userRepository;
	  var authResult;
	

		
	  let hUsername = request.header('username');
	  let hToken = request.header(require('../app_config').appTokenName);
	  let hIp = request.connection.remoteAddress;
	  let controlToken = Hasher.Md5.init(hUsername+hIp);



	  //controllo formale
	  if(hToken !== controlToken){
	  //hToken formalmente non valido
	  	throw new Error("Token formally invalid");
	  }



	  //controllo record
	  var result = await userRepository.find({
			usernamae: hUsername,
			session_token: controlToken
	  });

	  if(result.length != 1){
	  //non esiste questo utente
	  	throw new Error("Non existent user");
	  }
		
	  authResult = JSON.stringify(result[0]);
	  //console.log(authResult);
	  return authResult;
		

};

exports.unauthorizedResponse = require('./UnauthorizedResponse');