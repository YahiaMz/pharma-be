import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id : number;
    
    @Column({type : 'varchar' , length : 50 , nullable : false , unique : true})
    name : string;

    @Column({type : 'varchar' , nullable : true})
    categoryImageUrl : string;

    @CreateDateColumn()
    created_at : string;

    @UpdateDateColumn()
    updated_at : string;

    @OneToMany(type => Product , product => product.category , {onDelete : 'CASCADE' , onUpdate :'CASCADE'})
    public products : Product [];

}
