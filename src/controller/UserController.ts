import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {Md5} from "md5-typescript";

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

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
        
        var validation = schema.validate(request.body);
        
        if(validation.error != null && validation.error != undefined){
            return validation;
        }
         
        //EXTRACT DATA
        var userTimestamp = new Date().getTime();
        var userData = {
            username: request.body.username,
            password: Md5.init(request.body.password),
            sessionCreateTime: userTimestamp,
            sessionToken: Md5.init(request.body.username+request.body.password+userTimestamp)
        }
        
        var existingUser = this.userRepository.find({
          where: [
            { username: userData.username }
          ]
        });
        
        if(existingUser.length !== 0){
            return {
                error: "This username is already taken! Choose another please."
            };
        }    
        
        return this.userRepository.save(userData);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

}