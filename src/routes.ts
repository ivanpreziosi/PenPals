import {UserController} from "./controller/UserController";

var AppConfig = require('./app_config');

export const Routes = [
{
    method: "get",
    route: "/"+AppConfig.version+"/users",
    controller: UserController,
    action: "profile"
}, 
{
    method: "get",
    route: "/"+AppConfig.version+"/users/:id",
    controller: UserController,
    action: "one"
}, 
{
    method: "post",
    route: "/"+AppConfig.version+"/users",
    controller: UserController,
    action: "save"
}, 
{
    method: "delete",
    route: "/"+AppConfig.version+"/users/:id",
    controller: UserController,
    action: "remove"
}, 
{
    method: "post",
    route: "/"+AppConfig.version+"/login",
    controller: UserController,
    action: "login"
}
];