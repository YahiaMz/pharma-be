import { OrderItem } from "src/order-items/entities/order-item.entity";
import { UserAddress } from "src/user-address/entities/user-address.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id : number;
     
    @ManyToOne(type => User , user => user.myOrders , {  onDelete : 'SET NULL' , onUpdate : 'SET NULL'})
    @JoinColumn({ name : 'user_Id' ,referencedColumnName : 'id'})
    user : User;

    @OneToMany(type => OrderItem , orderI => orderI.order , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'} )
    items : OrderItem[];

    @Column({type : 'tinyint' , nullable : false , default : 1 })
    status : number;

    @Column({type : 'boolean' , default : true , nullable : false})
    isActive : boolean;

    @ManyToOne(type => UserAddress , { nullable : false ,onDelete : 'CASCADE' , onUpdate : 'CASCADE'}) 
    @JoinColumn({name : 'userAddress_Id'})
    userAddress : UserAddress;

    @Column({type : 'varchar' , length : 50})
    paymentMethod : String

    @CreateDateColumn()
    created_at : string;

    @UpdateDateColumn()
    updated_at : string;
}
