import { Cart } from "src/carts/entities/cart.entity";
import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { UserAddress } from "src/user-address/entities/user-address.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id : number ;

    @Column({type : 'varchar' , length : 30 , nullable : false})
    fullName : string;

    @Column({type : 'varchar',length : 50 , unique : true , nullable : false})
    email : string;

    @Column({type : 'varchar'})
    password : string;

    @Column({type:'varchar' , length : 10})    
    phoneNumber : string;

    @Column({type:"varchar" , nullable : true})
    imageProfile : string;

    @CreateDateColumn()
    created_at : string;

    @UpdateDateColumn()
    updated_at : string;

     
    @OneToMany(type => Order ,order => order.user , {onDelete :'SET NULL' , onUpdate : 'SET NULL'})
    myOrders : Order[];

    @OneToMany(type => Cart , cart => cart.user , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    cartItems : Cart[];


    @OneToMany(type => UserAddress , userAddress => userAddress.user )
    myAddresses : UserAddress[];

    @ManyToMany(type => Product , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinTable({name : 'usersLikeProducts'  })
    likes : Product[];
    


}
