import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('orderItems')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id : number ;

    @ManyToOne(type => Product , {onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
    @JoinColumn({name : 'product_Id'} ,)
    product : Product;

    @Column({type : 'int' , unsigned : true})
    quantity : number;

    @ManyToOne(type => Order , order => order.items , {onDelete : 'CASCADE' ,onUpdate : 'CASCADE'})
    @JoinColumn({ name : 'order_Id'})
    order : Order;
}
