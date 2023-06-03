import { HttpException, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MyHelper } from 'src/my-class-helper';
import { ResponseState } from 'src/RespnoceState';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream } from 'fs';
import { response } from 'express';
import { join } from 'path';

@Injectable()
export class CategoriesService {

  constructor( @InjectRepository(Category) private categoryRepository : Repository<Category>) {

  }

  async create(createCategoryDto: CreateCategoryDto , categoryImage : Express.Multer.File) {
    
    if (categoryImage  == null || !MyHelper.isAnPngImage(categoryImage.mimetype)) {
      throw new HttpException(
        ResponseState.failed_response('category image must be a type of png') ,
        200
      )
    }
      

    try {

      let newCategory =  this.categoryRepository.create({name : createCategoryDto.name});

      if(categoryImage) {

        let categoryFileName = 'category_'+uuidv4()+'.'+ MyHelper.getImageExtinction(categoryImage.mimetype);
        let imagePath = MyHelper.categoriesSvgImagePath + categoryFileName;

        let ws = createWriteStream(imagePath);
        ws.write(categoryImage.buffer);
        newCategory.categoryImageUrl = categoryFileName;
        
      }
       return await this.categoryRepository.save(newCategory);

       } catch (error) {
      
        throw new HttpException(
          ResponseState.failed_response('category name exist') ,
          200
        )

     }
  }

  async findAll() {
   try {
   let categories = await this.categoryRepository.find();
   return categories;
 } catch (error) {
  
  throw new HttpException(
    ResponseState.failed_response('something wrong !') ,
    200
  )
   
 }

  }

   async findOne(id: number) {
    try {
      let category = await this.categoryRepository.findOne({id : id} , {relations : ['products']});
      if(category) {
        return category;
      }
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong ') ,
        200
      )
    }


    throw new HttpException(
      ResponseState.failed_response('oops category not found ') ,
      200
    )




  }

   async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    let categoryToUpdate = await this.findCategoryByIdOrThrowException(id);
    categoryToUpdate.name = updateCategoryDto.name;
    
    try {
      return  await this.categoryRepository.save(categoryToUpdate);   
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('you cant update to this name , because it already exist ') ,
        200
      )
    }
   

  }

async remove(id: number) {
       let category = await this.findCategoryByIdOrThrowException(id);
      try {
        await this.categoryRepository.delete(category);
        return ;
      } catch (error) {
        throw new HttpException(
          ResponseState.failed_response('oops something wrong') ,
          200
        )
      }
  }


  public async findCategoryByIdOrThrowException( id : number){
    try {
      let category = await this.categoryRepository.findOne({id : id});
      if(category ) return category;
    } catch (error) {
      throw new HttpException(
        ResponseState.failed_response('something wrong !') ,
        200
      )

    }

    throw new HttpException(
      ResponseState.failed_response('oops category not found ') ,
      200
    )

  }


  async getCategoryImage ( imageName : string , @Res() response ) { 
       return await response.sendFile(join(process.cwd() , MyHelper.categoriesSvgImagePath + imageName));
  }

}
