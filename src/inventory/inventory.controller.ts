import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateItemInventory } from './dto/create-item-dto';
import { EditItemInventory } from './dto/edit-item-dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { storageFor1File } from '../books/utils/storage';
import { CreateInventoryDto } from './dto/create-inventory.dto';
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }



  @Post()
  @UseInterceptors(FileInterceptor('img', storageFor1File))
  create(@Body() createInventoryDto: CreateInventoryDto, @UploadedFile() img: Express.Multer.File) {

    return this.inventoryService.create(createInventoryDto);

  }

  @Get()
  findAll(@Query() query: any) {
    return this.inventoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  edit(@Param('id') id: string, @Body() updateInventoryDto: EditItemInventory) {
    return this.inventoryService.edit(id, updateInventoryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }
}
