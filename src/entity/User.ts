import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {Request} from "express";
import {ContactRequest} from "./ContactRequest";
import {ContactResponse} from "./ContactResponse";
import {Md5} from "md5-typescript";
var PenpalsDateUtils = require('../helper/PenpalsDateUtils');
var AppConfig = require('../app_config');

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;
	
	@OneToMany(type => ContactRequest, contactRequest => contactRequest.user)
	contactRequests: ContactRequest[];
	
	@OneToMany(type => ContactResponse, contactResponse => contactResponse.user)
    contactResponses: ContactResponse[];

    @Column({
		type: "varchar",
		length: 32,
		unique: true
	})
    username: string;

    @Column({
		type: "varchar",
		length: 32,
		select: false
	})
    password: string;
	
	@Column({
		type: "timestamp",
		select: false
	})
    user_create_time: number;
	
	@Column({
		type: "varchar",
		length: 32,
		nullable: true,
		select: false
	})
    session_token: string;
	
	@Column({
		type: "timestamp",
		nullable: true,
		select: false
	})
    session_create_time: number;

	//SETS A NEW A TOKEN
	SetToken(request: Request){
		let userTimestamp = PenpalsDateUtils.getMysqlDateNow();
		this.session_token = this.CreateToken(request);
        this.session_create_time = userTimestamp;
	}
	
	//VALIDATES TOKEN
	ValidateToken(request: Request){
		var controlToken = this.CreateControlToken(request);
		if(controlToken !== this.session_token){
			return false;
		};
		return true;		
	}
	
	//CreateToken
	CreateToken(request: Request){
		return  Md5.init(this.username+this.password+PenpalsDateUtils.getUnixTimestampNow()+AppConfig.appTokenSalt);
	}

	CreateControlToken(request: Request){
		console.log("creating ControlToken");
		console.log("username: "+this.username);
		console.log("session_token: "+this.session_token);
		console.log("control token: "+Md5.init(this.username+this.session_token));
		return Md5.init(this.username+this.session_token);
	}
	
	
}
