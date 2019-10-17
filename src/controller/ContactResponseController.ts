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

        const loggedUser = await this.userRepository.findByUsername(hUsername);


        // VALIDATE DATA
        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            responseText: Joi.string()
                .required(),
            requestId: Joi.number()
                .integer()
                .required(),
            recipientId: Joi.number()
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
        /////////////////////////////////////////////////////////////////////////

        
        try {
            //load contact request
            var contactRequest = await this.contactRequestRepository.findOne({
                where: {
                    id: request.body.requestId
                },
                relations: ["usersDelivered"]
            });

            // load recipient user
            const recipientUser = await this.userRepository.findOne(parseInt(request.body.recipientId));

            //create contact response
            let contactResponse = new ContactResponse();
            contactResponse.user = loggedUser;
            contactResponse.responseText = request.body.responseText;
            contactResponse.contactRequest = contactRequest;
            contactResponse.recipient = recipientUser;
            const result = await this.contactResponseRepository.save(contactResponse);

            //set this request as delivered for this user
            console.log("contactRequest.usersDelivered");
            console.log(contactRequest.usersDelivered);
            let usersDelivered = contactRequest.usersDelivered;
            usersDelivered.push(loggedUser);
            console.log(usersDelivered);
            contactRequest.usersDelivered = usersDelivered;
            console.log(contactRequest.usersDelivered);
            await this.contactRequestRepository.save(contactRequest);
            ////////////////////////////////////////////////

            DefaultResponse.responseData.status = "OK";
            DefaultResponse.responseData.code = "CONTACT-RESPONSE-SAVED";
            DefaultResponse.responseData.message = "Contact response saved successfully.";
        } catch (e) {
            console.log(e);
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = e.code;
            DefaultResponse.responseData.message = e.message;
            response.set('status', 418);
            return DefaultResponse.responseData;
        }

        return DefaultResponse.responseData;
    }

}