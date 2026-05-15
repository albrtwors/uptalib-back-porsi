import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventoryOperationService } from './inventory-operation.service';
import { CreateInventoryOperationDto } from './dto/create-inventory-operation.dto';
import { UpdateInventoryOperationDto } from './dto/update-inventory-operation.dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
import { LoanDto } from './dto/loan-dto';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('inventory-operation')
export class InventoryOperationController {
  constructor(private readonly inventoryOperationService: InventoryOperationService) { }

  //entries
  @Patch('entries')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addEntries(@Body() entriesDto: EntrieDto) {
    return this.inventoryOperationService.addEntries(entriesDto)
  }

  @Patch('drops')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addDrops(@Body() entriesDto: DropDto) {
    return this.inventoryOperationService.addDrops(entriesDto)
  }



  @Get('loan')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllLoans(@Query() query: any) {
    return this.inventoryOperationService.findAllLoans(query)
  }

  @Post('loan')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  loan(@Body() itemLoan: LoanDto) {
    return this.inventoryOperationService.loan(itemLoan)
  }

  @Patch('settle/:id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  settle(@Param('id') id: string) {
    return this.inventoryOperationService.settle(id)
  }

  @Post()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createInventoryOperationDto: CreateInventoryOperationDto) {
    return this.inventoryOperationService.create(createInventoryOperationDto);
  }

  @Get()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query: any) {
    return this.inventoryOperationService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.inventoryOperationService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateInventoryOperationDto: UpdateInventoryOperationDto) {
    return this.inventoryOperationService.update(+id, updateInventoryOperationDto);
  }

  @Delete(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.inventoryOperationService.remove(+id);
  }
}
