import {UserController} from "./controller/UserController";

var AppConfig = require('./app_config');

export const Routes = [
{
    method: "get",
    route: "/"+AppConfig.version+"/users",
    controller: UserController,
    action: "profile",
    isPublic: false
}, 
{
    method: "get",
    route: "/"+AppConfig.version+"/users/:id",
    controller: UserController,
    action: "one",
    isPublic: true
}, 
{
    method: "post",
    route: "/"+AppConfig.version+"/users",
    controller: UserController,
    action: "save",
    isPublic: true
}, 
{
    method: "delete",
    route: "/"+AppConfig.version+"/users/:id",
    controller: UserController,
    action: "remove",
    isPublic: false
}, 
{
    method: "post",
    route: "/"+AppConfig.version+"/login",
    controller: UserController,
    action: "login",
    isPublic: true
}
];