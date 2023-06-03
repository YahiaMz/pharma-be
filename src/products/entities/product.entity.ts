import { Category } from "src/categories/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
export class Product {


   @PrimaryGeneratedColumn()
   id : number;
 
   @Column({type :'varchar' , length : 50  , nullable : false , unique : true })
   name : string ;

   @Column({ type : 'varchar' , nullable : true })
   description : string;

   @Column({ type : 'double' , unsigned : true , nullable : false})
   price : number;
 
   @Column({type : 'varchar' , nullable : true })
   imageUrl : string;

   @Column({type : 'int' , unsigned : true , nullable : false , default : 0})
   quantityInStock : number;

   @CreateDateColumn()
   created_at : string ;

   @UpdateDateColumn()
   updated_at : string;

   @ManyToOne( type => Category , category => category.products  , {nullable : false , onDelete : 'CASCADE' , onUpdate : 'CASCADE'})
   @JoinColumn({name : 'category_Id' , 'referencedColumnName' : 'id'})
   category : Category;


}
