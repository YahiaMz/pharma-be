import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResponseState } from 'src/RespnoceState';
import { FileInterceptor } from '@nestjs/platform-express';
import { MyHelper } from 'src/my-class-helper';
import { join } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('productImage'))
    async create(@Body() createProductDto: CreateProductDto , @UploadedFile() product_image  : Express.Multer.File) {
    
      if(product_image == null || !MyHelper.isAnPngImage(product_image.mimetype)) {
        return ResponseState.failed_response("product image is required and must be of type .png");
      }
      let newProduct = await this.productsService.create(createProductDto , product_image);
    return ResponseState.success_response(newProduct);
  }

  @Get('/to/:user_Id')
  async findAll(@Param('user_Id') user_Id : string ) {
    let products = await this.productsService.findAllWithIsLike( +user_Id );
    return ResponseState.success_response(products);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('productImage'))
 async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto ,  @UploadedFile() product_image  : Express.Multer.File) {
  
  let isThisObjectEmpty = Object.keys(updateProductDto).length === 0;
  if( isThisObjectEmpty ) {
    return ResponseState.success_response('no thing to update');
  }

  if(product_image && !MyHelper.isAnPngImage(product_image.mimetype)) {
    return ResponseState.failed_response("product image must be of type .png");
  }
  
  let updatedProduct = await this.productsService.update(+id, updateProductDto , product_image);
  return ResponseState.success_response(updatedProduct);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
    return ResponseState.success_response('product has been removed with success !');
  }

  @Get('/images/:imageUrl')
  async sendProductImage(@Param('imageUrl')  imageUrl : string , @Res() res) {
    return await res.sendFile(join(process.cwd() , MyHelper.productImagePath + imageUrl));
   }

}
