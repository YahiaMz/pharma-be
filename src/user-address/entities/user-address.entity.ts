import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['name' , 'user'])
export class UserAddress {

    @PrimaryGeneratedColumn()
    id : number ; 

    @Column({type : 'varchar' , nullable : false }) 
    name : string;

    @Column({type : 'varchar' , nullable : false }) 
    address : string;

    @ManyToOne(type => User , user => user=>user.myAddresses , {onDelete : 'CASCADE' , onUpdate : "CASCADE"})
    @JoinColumn({name : 'user_Id'})
    user : User;
}
