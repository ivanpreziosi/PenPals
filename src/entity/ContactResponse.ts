import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { ContactRequest } from "./ContactRequest";

@Entity()
export class ContactResponse {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ContactRequest, contactRequest => contactRequest.contactResponses, {
        nullable: false
    })
    contactRequest: ContactRequest;

    @ManyToOne(type => User, user => user.contactRequests, {
        nullable: false
    })
    user: User;

    @Column({
        type: "text",
    })
    response_text: string;

    @Column({
        type: "timestamp",
    })
    response_create_time: number;

    @Column({
        type: "tinyint",
        nullable: false,
        default: '1'
    })
    is_active: number;


}
