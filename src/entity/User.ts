import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import {Request} from "express";
import {Md5} from "md5-typescript";
var PenpalsDateUtils = require('../helpers/PenpalsDateUtils');

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

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
	
	@Column("timestamp")
    user_create_time: number;
	
	@Column({
		type: "varchar",
		length: 32,
		nullable: true
	})
    session_token: string;
	
	@Column({
		type: "timestamp",
		nullable: true
	})
    session_create_time: number;
	
	//SETS A NEW A TOKEN
	SetToken(request: Request){
		let userTimestamp = PenpalsDateUtils.getMysqlDateNow();
		var remoteIp = request.header('x-forwarded-for');
		this.session_token = this.CreateToken(request);
        this.session_create_time = userTimestamp;
	}
	
	//VALIDATES TOKEN
	ValidateToken(request: Request){
		var controlToken = this.CreateToken(request);
		if(controlToken !== this.session_token){
			return false;
		};
		return true;		
	}
	
	//CreateToken
	CreateToken(request: Request){
		var remoteIp = request.header('x-forwarded-for');
		return  Md5.init(this.username+this.password+remoteIp);
	}

}
