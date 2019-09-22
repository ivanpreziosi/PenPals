import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Md5} from "md5-typescript";
var PenpalsDateUtils = require('../helpers/PenpalsDateUtils');
var DefaultResponse = require('../helpers/DefaultResponse');

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }
    
    /**
    // Save user POST
    **/
    async save(request: Request, response: Response, next: NextFunction) {        
        // VALIDATE DATA
		const Joi = require('@hapi/joi');

		const schema = Joi.object({
            username: Joi.string()
                .alphanum()
                .min(3)
                .max(32)
                .required(),

            password: Joi.string()
                .pattern(/^[a-zA-Z0-9]{3,30}$/)
                .min(6)
                .max(32)
                .required(),

            repeat_password: Joi.ref('password'),
        })
        
        let validation = schema.validate(request.body);
        
        if(validation.error != null && validation.error != undefined){
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = "DATA-VALIDATION";
            DefaultResponse.responseData.message = validation.error.details[0].message;
            response.set('status',400);
            return DefaultResponse.responseData;
        }
         
        //create model
        let userTimestamp = PenpalsDateUtils.getMysqlDateNow();
        let user = new User();
        user.username = request.body.username;
        user.password = Md5.init(request.body.password);
        user.session_token = Md5.init(request.body.username+request.body.password+userTimestamp);
        user.session_create_time = userTimestamp;
        
        //save model  
        
        try{
            let result = await this.userRepository.save(user);
            console.log(result);
            DefaultResponse.responseData.status = "OK";
            DefaultResponse.responseData.code = "USER-SAVED";
            DefaultResponse.responseData.message = "User saved successfully.";
            response.set('status',201);
            response.set('Pp-S-Tk',user.session_token);
        }catch(e){
            console.log(e);
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = e.code;
            DefaultResponse.responseData.message = e.message;
            response.set('status',418);
        }
        return DefaultResponse.responseData;
        
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}