import { getCustomRepository, getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { ContactRequest } from "../entity/ContactRequest";
import { ContactResponse } from "../entity/ContactResponse";
import { UserRepository } from "../repository/UserRepository";
import { MoreThanOrEqual } from "typeorm";
import { Not } from "typeorm";
var DefaultResponse = require('../tpl/DefaultResponse');
var DateHelper = require('../helper/PenpalsDateUtils');

export class ContactResponseController {

    private userRepository = getCustomRepository(UserRepository);
    private contactRequestRepository = getRepository(ContactRequest);
    private contactResponseRepository = getRepository(ContactResponse);

    /**
    // get my responses GET
    **/
    async request(request: Request, response: Response, next: NextFunction) {
        try {

            //get requests
            const result = await this.contactResponseRepository.find({
                where: {
                    request_create_time: MoreThanOrEqual(DateHelper.getRequestExpirationDate().toString()),
                    contactRequest: request.params.reqId
                }
            });

            return result;
        } catch (e) {
            return e;
        }

    }


    /**
    // Save ContactResponse POST
    **/
    async save(request: Request, response: Response, next: NextFunction) {
        //get current user 
        let hUsername = request.header('username');
        let hToken = request.header(require('../app_config').appTokenName);

        const loggedUser = await this.userRepository.findByHeaderAuth(hUsername, hToken);


        // VALIDATE DATA
        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            response_text: Joi.string()
                .required(),
            request_id: Joi.number()
                .integer()
                .required()
        })

        let validation = schema.validate(request.body);

        if (validation.error != null && validation.error != undefined) {
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = "DATA-VALIDATION";
            for (var ii = 0; ii < validation.error.details.length; ii++) {
                DefaultResponse.responseData.message = validation.error.details[ii].message + " ** ";
            }
            response.set('status', 400);
            return DefaultResponse.responseData;
        }

        try {
            const contactRequest = this.contactRequestRepository.findOne(request.body.request_id);
            contactRequest.then(
                async function successHandler(contactRequest) {
                    //create contactResponse model        
                    let contactResponse = new ContactResponse();
                    contactResponse.user = loggedUser;
                    contactResponse.contactRequest = contactRequest;
                    contactResponse.response_text = request.body.response_text;

                    //save model          
                    try {
                        const result = await getRepository(ContactResponse).save(contactResponse);
                        console.log(result);
                        DefaultResponse.responseData.status = "OK";
                        DefaultResponse.responseData.code = "CONTACT-REQUEST-SAVED";
                        DefaultResponse.responseData.message = "User saved successfully.";
                        return DefaultResponse.responseData;
                    } catch (e) {
                        console.log(e);
                        DefaultResponse.responseData.status = "KO";
                        DefaultResponse.responseData.code = e.code;
                        DefaultResponse.responseData.message = e.message;
                        response.set('status', 418);
                        return DefaultResponse.responseData;
                    }

                },
                function failureHandler(e) {
                    console.log(e);
                    DefaultResponse.responseData.status = "KO";
                    DefaultResponse.responseData.code = e.code;
                    DefaultResponse.responseData.message = e.message;
                    response.set('status', 418);
                    return DefaultResponse.responseData;
                });
        } catch (e) {
            console.log(e);
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = e.code;
            DefaultResponse.responseData.message = e.message;
            response.set('status', 418);
            return DefaultResponse.responseData;
        }


    }

}