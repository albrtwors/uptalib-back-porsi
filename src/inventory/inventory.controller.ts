import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateItemInventory } from './dto/create-item-dto';
import { EditItemInventory } from './dto/edit-item-dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { storageFor1File } from '../books/utils/storage';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }



  @Post()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('img', storageFor1File))
  create(@Body() createInventoryDto: CreateInventoryDto, @UploadedFile() img: Express.Multer.File) {

    return this.inventoryService.create(createInventoryDto);

  }

  @Get()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query: any) {
    return this.inventoryService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  edit(@Param('id') id: string, @Body() updateInventoryDto: EditItemInventory) {
    return this.inventoryService.edit(id, updateInventoryDto);
  }

  @Delete(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  delete(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }
}
