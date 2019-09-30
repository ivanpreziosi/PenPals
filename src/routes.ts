import {UserController} from "./controller/UserController";
import {ContactRequestController} from "./controller/ContactRequestController";

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
    method: "post",
    route: "/"+AppConfig.version+"/users",
    controller: UserController,
    action: "save",
    isPublic: true
}, 
{
    method: "post",
    route: "/"+AppConfig.version+"/login",
    controller: UserController,
    action: "login",
    isPublic: true
}, 

/** CONTACT REQUESTS **/
{
    method: "post",
    route: "/"+AppConfig.version+"/reqs",
    controller: ContactRequestController,
    action: "save",
    isPublic: false
},
{
    method: "get",
    route: "/"+AppConfig.version+"/reqs",
    controller: ContactRequestController,
    action: "mine",
    isPublic: false
}
];