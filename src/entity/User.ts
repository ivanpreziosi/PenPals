import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 32 })
    username: string;

    @Column("varchar", { length: 32 })
    password: string;
	
	@Column("timestamp")
    user_create_time: number;

}
