import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

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

    @Column("varchar", { length: 32 })
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

}
