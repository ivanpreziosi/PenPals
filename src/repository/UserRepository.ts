import {EntityRepository, Repository} from "typeorm";
import {User} from "../entity/User";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    //SETS A NEW A TOKEN
	SetToken(request: Request){
		let userTimestamp = PenpalsDateUtils.getMysqlDateNow();
		this.session_token = this.CreateToken(request);
        this.session_create_time = userTimestamp;
	}
	
	//VALIDATES TOKEN
	ValidateToken(request: Request){
		var controlToken = this.CreateToken(request);
		if(controlToken !== this.session_token){
			return false;
		};
		return true;		
	}
	
	//CreateToken
	CreateToken(request: Request){
		var remoteIp = request.connection.remoteAddress;
		return  Md5.init(this.username+remoteIp+AppConfig.appTokenSalt);
	}

}