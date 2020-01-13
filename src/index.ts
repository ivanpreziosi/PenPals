import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User } from "./entity/User";
import { Md5 } from "md5-typescript";
import { getRepository } from "typeorm";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "./repository/UserRepository";

var AppConfig = require('./app_config');

createConnection().then(async connection => {

    var listenPort = AppConfig.listenPort;

    // create express app
    const app = express();
    app.use(bodyParser.urlencoded({
        extended: true
    }));



    //app.use(express.json()) // for parsing application/json

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {

            if (!route.isPublic) {

                //let userRepository = getCustomRepository(UserRepository);
                var Auth = require('./helper/PenpalsAuthentication');
                const authResult = Auth.checkAuth(req);

                authResult.then(function (ar) {
                    console.log("Authorized");
                    console.log("Processing request");
                    const result = (new (route.controller as any))[route.action](req, res, next);
                    if (result instanceof Promise) {
                        result.then(result => result !== null && result !== undefined ? res.json(result) : res.json(require('./tpl/UnauthorizedResponse'))).catch(e => res.json(require('./tpl/UnauthorizedResponse')));
                    } else if (result !== null && result !== undefined) {
                        res.json(result);
                    }

                }, function (err) {
                    console.log("Authorization denied");

                    res.json(require('./tpl/UnauthorizedResponse'));
                });

            } else {

                console.log("Processing request");
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.json(result) : res.json(require('./tpl/UnauthorizedResponse'))).catch(e => res.json(require('./tpl/UnauthorizedResponse')));
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }

            }

        });
    });



    // start express server
    app.listen(listenPort);

    console.log("Penpals server has started on port " + listenPort + ".");

}).catch(error => console.log(error));

