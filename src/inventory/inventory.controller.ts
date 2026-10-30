import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateItemInventory } from './dto/create-item-dto';
import { EditItemInventory } from './dto/edit-item-dto';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { BulkIdsDto } from '../utils/bulk-ids.dto';
import { BulkInventoryDto } from './dto/bulk-inventory.dto';
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
  create(@Body() createInventoryDto: CreateInventoryDto) {

    return this.inventoryService.create(createInventoryDto);

  }

  // 📦 Alta y edición de varios artículos en un único lote
  @Post('bulk')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  bulk(@Body() bulkInventoryDto: BulkInventoryDto) {
    return this.inventoryService.bulkUpsert(bulkInventoryDto.records);
  }

  // 📦 Borrado de uno o varios artículos en lote
  @Post('bulk-delete')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  bulkDelete(@Body() bulkIdsDto: BulkIdsDto) {
    return this.inventoryService.removeMany(bulkIdsDto.ids);
  }

  @Get()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query: any) {
    return this.inventoryService.findAll(query);
  }

  // 📦 Ejemplares individuales del artículo
  @Get(':id/copies')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findCopies(@Param('id') id: string) {
    return this.inventoryService.findCopies(id);
  }

  @Post(':id/copies')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addCopies(@Param('id') id: string, @Body() dto: any) {
    return this.inventoryService.addCopies(id, dto);
  }

  @Patch('copies/:copyId')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateCopy(@Param('copyId') copyId: string, @Body() dto: any) {
    return this.inventoryService.updateCopy(copyId, dto);
  }

  @Delete('copies/:copyId')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeCopy(@Param('copyId') copyId: string) {
    return this.inventoryService.removeCopy(copyId);
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
