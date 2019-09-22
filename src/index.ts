import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entity/User";
import {Md5} from "md5-typescript";

var AppConfig = require('./app_config');


createConnection().then(async connection => {
    
    var listenPort = "1312";

    // create express app
    const app = express();
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    
    //app.use(express.json()) // for parsing application/json

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(listenPort);

    // insert new users for test
	/*
    await connection.manager.save(connection.manager.create(User, {
        username: "ivan",
        password: Md5.init('ivan')
    }));
    await connection.manager.save(connection.manager.create(User, {
        username: "ivan2",
        password: Md5.init('ivan')
    }));
	*/
    console.log("Express server has started on port "+listenPort+". Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
