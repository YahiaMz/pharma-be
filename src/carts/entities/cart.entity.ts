import { Product } from "src/products/entities/product.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('carts')
export class Cart {

    @PrimaryGeneratedColumn()
    id : number ;
    
    @ManyToOne(type => User , user => user.cartItems , {onDelete:'CASCADE' , onUpdate : 'CASCADE'})
    user : User;
    
    @Column({type : "int" , nullable : false , default : 1 , unsigned : true})
    quantity : number;
     
    @ManyToOne(type => Product , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'product_Id'} ,)
    product : Product;


}
