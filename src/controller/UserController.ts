import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import { ContactRequest } from "../entity/ContactRequest";
import { Md5 } from "md5-typescript";
var DefaultResponse = require('../tpl/DefaultResponse');
var AppConfig = require('../app_config');
var DateHelper = require('../helper/PenpalsDateUtils');
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../repository/UserRepository";
import { Not, In, MoreThanOrEqual } from "typeorm";

export class UserController {

    private userRepository = getCustomRepository(UserRepository);
    private contactRequestRepository = getRepository(ContactRequest);

    /****************************
    // USER RESOURCES ***********
    ****************************/

	/**
    // retrieve user profile GET
    **/
    async profile(request: Request, response: Response, next: NextFunction) {
        try {
            let hUsername = request.header('username');
            let hToken = request.header(require('../app_config').appTokenName);

            const user = await this.userRepository.findByUsername(hUsername);
            const deliveredRequests = await this.contactRequestRepository.createQueryBuilder('request')
                .select("request.id")
                .innerJoin(
                    'request.users_delivered',
                    'user',
                    '(user.username = :username)',
                    { username: user.username }
                ).where("request.is_active = 1 AND request.request_create_time >='" + DateHelper.getRequestExpirationDate().toString() + "'").groupBy(request.id).getMany();

            var deliveredRequestsIds = new Array();
            deliveredRequests.forEach(req => {
                deliveredRequestsIds.push(req.id);
            });

            const undeliveredRequests = await this.contactRequestRepository.createQueryBuilder('request')
                .where({
                    id: Not(In(deliveredRequestsIds)),
                    is_active: 1,
                    request_create_time: MoreThanOrEqual(DateHelper.getRequestExpirationDate().toString())
                }).getMany();


            return {
                status: "OK",
                code: "DASHBOARD-INFO",
                message: "Dashboard info succesfully obtained.",
                user: user,
                newRequests: undeliveredRequests
            };
        } catch (e) {
            return {
                status: "KO",
                code: "DASHBOARD-INFO-ERROR",
                message: e.message
            };
        }

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

        if (validation.error != null && validation.error != undefined) {
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = "DATA-VALIDATION";
            for (var ii = 0; ii < validation.error.details.length; ii++) {
                DefaultResponse.responseData.message = validation.error.details[ii].message + " ** ";
            }
            response.set('status', 400);
            return DefaultResponse.responseData;
        }

        //create model        
        let user = new User();
        user.username = request.body.username;
        user.password = Md5.init(request.body.password);
        user.SetToken(request);

        //save model          
        try {
            let result = await this.userRepository.save(user);
            console.log(result);
            DefaultResponse.responseData.status = "OK";
            DefaultResponse.responseData.code = "USER-SAVED";
            DefaultResponse.responseData.message = "User saved successfully.";
            response.set('status', 201);
            //response.set(AppConfig.appTokenName,user.session_token);
        } catch (e) {
            console.log(e);
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = e.code;
            DefaultResponse.responseData.message = e.message;
            response.set('status', 418);
        }
        return DefaultResponse.responseData;

    }

	/**
    // login user GET
    **/
    async login(request: Request, response: Response, next: NextFunction) {
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

        //find user in db
        try {
            let result = await this.userRepository.find({
                select: ['id', 'username', 'session_token'],
                where: [
                    { username: request.body.username, password: Md5.init(request.body.password) }
                ]
            });
            if (result.length < 1) {
                throw {
                    code: "LOGIN-ERROR",
                    message: "Login unsuccesfull, check your credentials."
                };
            }
            let user = result[0];
            user.SetToken(request);
            await this.userRepository.save(user);
            console.log(user);
            DefaultResponse.responseData.status = "OK";
            DefaultResponse.responseData.code = "USER-LOGGED-IN";
            DefaultResponse.responseData.message = "User logged in successfully.";
            DefaultResponse.responseData.payload = {
                id: user.id,
                username: user.username,
                authTokencontrolToken: Md5.init(user.username + user.session_token)
            };
            response.set('status', 200);
            response.set(AppConfig.appTokenName, user.session_token);
        } catch (e) {
            console.log(e);
            DefaultResponse.responseData.status = "KO";
            DefaultResponse.responseData.code = e.code;
            DefaultResponse.responseData.message = e.message;
            response.set('status', 418);
        }

        return DefaultResponse.responseData;

    }

}