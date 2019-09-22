
exports.checkAuth = function (request) {
	const Hasher = require("md5-typescript");
	try{
		let hUsername = request.header('username');
		let hToken = request.header(require('../app_config').appTokenName);
		let hIp = request.connection.remoteAddress;
		let controlToken = Hasher.Md5.init(hUsername+hIp);

		
		
		//controllo formale
		if(hToken !== controlToken){
			//hToken formalmente non valido
			return false;
		}

		return true;
	}catch(e){
		console.log(e);
		return false;
	}
};

exports.unauthorizedResponse = require('./UnauthorizedResponse');