import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Request} from "express";
import {User} from "./User";
import {Md5} from "md5-typescript";
var PenpalsDateUtils = require('../helper/PenpalsDateUtils');
var AppConfig = require('../app_config');

@Entity()
export class ContactRequest {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.contactRequests)
    user: User;

    @Column({
		type: "text",
	})
    request_text: string;
	
	@Column({
		type: "timestamp",
	})
    request_create_time: number;
	
	@Column({
		type: "tinyint",
		nullable: false,
		default: '1'
	})
    is_active: number;

	
}
