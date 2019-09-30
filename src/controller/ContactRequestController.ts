import {getCustomRepository, getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {ContactRequest} from "../entity/ContactRequest";
import {UserRepository} from "../repository/UserRepository";
import {MoreThanOrEqual} from "typeorm";
import {Not} from "typeorm";
var DefaultResponse = require('../tpl/DefaultResponse');
var AppConfig = require('../app_config');
var DateHelper = require('../helper/PenpalsDateUtils');

export class ContactRequestController {

    private userRepository = getCustomRepository(UserRepository);
    private contactRequestRepository = getRepository(ContactRequest);

    /**
    // get my requests GET
    **/
    async mine(request: Request, response: Response, next: NextFunction) {       
        try{
            //get current user 
            let hUsername = request.header('username');
            let hToken = request.header(require('../app_config').appTokenName);            
            const loggedUser = await this.userRepository.findByHeaderAuth(hUsername,hToken);

            //get requests
            const result = await this.contactRequestRepository.find({where: { user:  loggedUser, request_create_time: MoreThanOrEqual(DateHelper.getRequestExpirationDate().toString())} })

            return result;
        }catch(e){
            return e;
        }
        
    }
    
     /**
    // get others requests GET
    **/
    async all(request: Request, response: Response, next: NextFunction) {       
        try{
            //get current user 
            let hUsername = request.header('username');
            let hToken = request.header(require('../app_config').appTokenName);            
            const loggedUser = await this.userRepository.findByHeaderAuth(hUsername,hToken);

            //get requests
            const result = await this.contactRequestRepository.find({
                join: {
                    alias: "req",
                    leftJoinAndSelect: {
                        user: "req.user"
                    }
                },
                where: { user:  Not(loggedUser.id), request_create_time: MoreThanOrEqual(DateHelper.getRequestExpirationDate().toString())} 
                
            })

            return result;
        }catch(e){
            return e;
        }
        
    }
    
    /**
    // Save ContactRequest POST
    **/
    async save(request: Request, response: Response, next: NextFunction) {        
        //get current user 
        let hUsername = request.header('username');
        let hToken = request.header(require('../app_config').appTokenName);
        
        const loggedUser = await this.userRepository.findByHeaderAuth(hUsername,hToken);
        
     
            // VALIDATE DATA
        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            request_text: Joi.string()
                .required(),
        })
        
        let validation = schema.validate(request.body);
        
        if(validation.error != null && validation.error != undefined){
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = "DATA-VALIDATION";
            for(var ii = 0;ii<validation.error.details.length;ii++){
                DefaultResponse.responseData.message = validation.error.details[ii].message+" ** ";
            }
            response.set('status',400);
            return DefaultResponse.responseData;
        }
         
        //create model        
        let contactRequest = new ContactRequest();
        contactRequest.user = loggedUser;
        contactRequest.request_text = request.body.request_text;
        
        //save model          
        try{
            let result = await this.contactRequestRepository.save(contactRequest);
            console.log(result);
            DefaultResponse.responseData.status = "OK";
            DefaultResponse.responseData.code = "CONTACT-REQUEST-SAVED";
            DefaultResponse.responseData.message = "User saved successfully.";
        }catch(e){
            console.log(e);
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = e.code;
            DefaultResponse.responseData.message = e.message;
            response.set('status',418);
        }
        return DefaultResponse.responseData;
        
        
        
    }

    

}