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

}