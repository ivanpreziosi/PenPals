import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany} from "typeorm";
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

	@OneToMany(type => ContactResponse, contactResponse => contactResponse.recipient)
	recipientResponses: ContactResponse[];
	
	@ManyToMany(type => ContactRequest, contactRequest => contactRequest.usersResponded)
    ViewedRequests: ContactRequest[];

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
    userCreateTime: number;
	
	@Column({
		type: "varchar",
		length: 32,
		nullable: true,
		select: false
	})
    sessionToken: string;
	
	@Column({
		type: "timestamp",
		nullable: true,
		select: false
	})
    sessionCreateTime: number;

	//SETS A NEW A TOKEN
	SetToken(request: Request){
		let userTimestamp = PenpalsDateUtils.getMysqlDateNow();
		this.sessionToken = this.CreateToken(request);
        this.sessionCreateTime = userTimestamp;
	}
	
	//VALIDATES TOKEN
	ValidateToken(request: Request){
		var controlToken = this.CreateControlToken(request);
		if(controlToken !== this.sessionToken){
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
		console.log("session_token: "+this.sessionToken);
		console.log("control token: "+Md5.init(this.username+this.sessionToken));
		return Md5.init(this.username+this.sessionToken);
	}
	
	
}
