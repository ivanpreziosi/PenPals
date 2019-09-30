import {EntityRepository, Repository} from "typeorm";
import {ContactRequest} from "../entity/ContactRequest";
import {User} from "../entity/User";
import {Request} from "express";
import {Md5} from "md5-typescript";
var PenpalsDateUtils = require('../helper/PenpalsDateUtils');
var AppConfig = require('../app_config');

@EntityRepository(ContactRequest)
export class ContactRequestRepository extends Repository<ContactRequest> {

    findByUser(usernameToSearch: string) {
        //return this.findOne({ username: usernameToSearch });
    }
	
	createRequest(user:User, requestText:string){
		
	}
    
    

}