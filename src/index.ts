import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var contactRequestRouter = require('./routes/contactRequest');
var contactResponseRouter = require('./routes/contactResponse');

var AppConfig = require('./app_config');
var Auth = require('./helper/PenpalsAuthentication');

//
/**
 * typeorm create connection vedi:https://github.com/typeorm/typeorm/blob/master/docs/connection-api.md#connection-api
 * createConnection() - Creates a new connection and registers it in global connection manager. 
 * If connection options parameter is omitted then connection options are read from ormconfig file or environment variables.
 */
createConnection().then(async connection => {

    var listenPort = AppConfig.listenPort;

    // create express app
    const app = express();

    //middleware stack
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(function (req, res, next) {
        console.log(req.method + " " + req.path);
        return next();
    });

    app.use(function (req, res, next) {
        Auth.checkAuth(req, res, next);
    });

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/reqs', contactRequestRouter);
    app.use('/resp', contactResponseRouter);

    //error handler
    app.use(function errorHandler(err, req, res, next) {
        var unauthorizedResponse = require('./tpl/UnauthorizedResponse');
        unauthorizedResponse.responseData.message = err.message;
        res.json(unauthorizedResponse);
    });

    // start express server
    app.listen(listenPort);

    console.log("Penpals server has started on port " + listenPort + ".");

}).catch(error => console.log(error));

