import { Order } from "src/orders/entities/order.entity";
import { Product } from "src/products/entities/product.entity";

export class OrderItemModel {
   

constructor( order : Order , product : Product , quantity : number ) {
    this.order = order ;
    this.product = product;
    this.quantity = quantity;
}

    order : Order;

    product : Product;

    quantity : number;

}