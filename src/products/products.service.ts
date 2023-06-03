import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { MyHelper } from 'src/my-class-helper';
import { ResponseState } from 'src/RespnoceState';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';

@Injectable()
export class ProductsService {


  constructor(@InjectRepository(Product) private productRepository : Repository<Product> ,
              private categoryService : CategoriesService 
  ){ }

  async create(createProductDto: CreateProductDto , productImage : Express.Multer.File) {

    let category =  await this.categoryService.findCategoryByIdOrThrowException(createProductDto.category_Id );
     try {

      let fileName =  'product_' + uuidv4() + '.png';
      let imageSavePath = MyHelper.productImagePath + fileName;
      const sw = createWriteStream(imageSavePath);
      await sw.write(productImage.buffer);



       let newProduct = this.productRepository.create({
         imageUrl : fileName ,
         name : createProductDto.name , 
         description : createProductDto.description , 
         price : createProductDto.price , 
         quantityInStock :createProductDto.quantityInStock ,
         category : category
       });

        return await this.productRepository.save(newProduct);

     } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('product name exist') ,
        200
      )
     }

  }

 async findAll() {
   try {
    let products = await this.productRepository.find({ loadRelationIds :true});
    return products;    
   } catch (error) {
    throw new HttpException(
      ResponseState.failed_response('something wrong while fetching products') ,
      200
    )
   }
 
  }


 async findAllWithIsLike(user_Id : number) {
  try {
   let products = await this.productRepository.query(`select p.id , p.name , p.category_Id as 'category' , p.quantityInStock , p.imageUrl , p.price , p.description , count(case ul.userid when ${user_Id} then 1 else null end) as "isLike" from products p left join usersLikeProducts ul on p.id = ul.productsid group by p.id`)
   return products;    
  } catch (error) {
   throw new HttpException(
     ResponseState.failed_response('something wrong while fetching products' + error.message) ,
     200
   )
  }

 }



  public async findProductByIdOrThrowException( product_Id  : number ) { 
    try {
       let product = await this.productRepository.findOne({id : product_Id});
        if(product) return product;
    } catch (error) { 
      throw new HttpException(
        ResponseState.failed_response('something wrong !') ,
        200
      );
    }


    throw new HttpException(
      ResponseState.failed_response('oops product not found ') ,
      200
    );


  }

 async update(id: number, updateProductDto: UpdateProductDto , imageProduct : Express.Multer.File ) {
    
  let productToUpdate  = await this.findProductByIdOrThrowException(id);
    
    let newCategoryForThisProduct = null;
    if(updateProductDto.category_Id) {

      newCategoryForThisProduct = await this.categoryService.findCategoryByIdOrThrowException(updateProductDto.category_Id);
      productToUpdate.category = newCategoryForThisProduct;
    }
    


    Object.assign(productToUpdate , updateProductDto);
    
    try {

      if(imageProduct) {
        let imageSavePath = MyHelper.productImagePath + productToUpdate.imageUrl;
        const sw = createWriteStream(imageSavePath);
        await sw.write(imageProduct.buffer);
      }

        return await this.productRepository.save(productToUpdate);
       } catch (error) {
        throw new HttpException(
          ResponseState.failed_response('something wrong while updating product') ,
          200
        )
    }
  }

  async remove(id: number) {
    let productToRemove  = await this.findProductByIdOrThrowException(id);
    
    try {
       await this.productRepository.remove(productToRemove);
       return;
       } catch (error) {
        throw new HttpException(
          ResponseState.failed_response('something wrong while removing product') ,
          200
        )
    }

  }


  async updateQuantity(id: number, addedQuantity : number) {
    
    let productToUpdate  = await this.findProductByIdOrThrowException(id);
    productToUpdate.quantityInStock += addedQuantity;      
      try {
           await this.productRepository.save(productToUpdate);
          return;
          } catch (error) {
          throw new HttpException(
            ResponseState.failed_response('something wrong while updating product') ,
            200
          )
      }
    }


}
