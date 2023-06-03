import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseState } from 'src/RespnoceState';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createCategoryDto: CreateCategoryDto , @UploadedFile() image : Express.Multer.File) {
    console.log(image);
    
    let newCategory = await this.categoriesService.create(createCategoryDto , image);
     return ResponseState.success_response(newCategory);
   }

  @Get()
 async findAll() {
     let categories = await this.categoriesService.findAll();
    return ResponseState.success_response(categories);
     }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let categoryWithItProducts = await this.categoriesService.findOne(+id);
     return ResponseState.success_response(categoryWithItProducts);
   }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    let updatedCategory = await this.categoriesService.update(+id, updateCategoryDto);
    return ResponseState.success_response(updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
   return ResponseState.success_response('category removed with success !');
  }

 @Get('/images/:imageName')
 async getImage( @Param('imageName') imageName : string , @Res() res ) {
       return await this.categoriesService.getCategoryImage(imageName , res);
 }

}
