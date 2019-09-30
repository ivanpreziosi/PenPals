import {EntityRepository, Repository} from "typeorm";
import {ContactRequest} from "../entity/ContactRequest";
import {User} from "../entity/User";
import {Request} from "express";
import {Md5} from "md5-typescript";
var PenpalsDateUtils = require('../helper/PenpalsDateUtils');
var AppConfig = require('../app_config');

@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findByUsername(usernameToSearch: string) {
        return this.findOne({ username: usernameToSearch });
    }
	
	deleteAuthToken(user:User){
		user.session_token = null;
		user.session_create_time = null;
		return this.save(user);
	}
    
    findByHeaderAuth(usernameToSearch: string, tokenToSearch: string) {
        return this.findOne({ username: usernameToSearch, session_token:tokenToSearch });
    }

}