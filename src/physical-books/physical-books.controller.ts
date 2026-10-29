import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PhysicalBooksService } from './physical-books.service';
import { CreatePhysicalBookDto } from './dto/create-physical-book.dto';
import { UpdatePhysicalBookDto } from './dto/update-physical-book.dto';
import { BulkPhysicalBookDto } from './dto/bulk-physical-book.dto';
import { BulkIdsDto } from '../utils/bulk-ids.dto';
import { Role } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('physical-book')
export class PhysicalBooksController {
  constructor(private readonly physicalBooksService: PhysicalBooksService) { }

  @Post()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createPhysicalBookDto: CreatePhysicalBookDto) {
    return this.physicalBooksService.create(createPhysicalBookDto);
  }

  // 📦 Inserción o edición de uno o varios registros en lote
  @Post('bulk')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  bulk(@Body() bulkPhysicalBookDto: BulkPhysicalBookDto) {
    return this.physicalBooksService.bulkUpsert(bulkPhysicalBookDto.records);
  }

  @Post('bulk-delete')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  bulkDelete(@Body() bulkIdsDto: BulkIdsDto) {
    return this.physicalBooksService.removeMany(bulkIdsDto.ids);
  }

  @Get()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query) {
    return this.physicalBooksService.findAll(query);
  }

  // 📦 Ejemplares individuales del libro
  @Get(':id/copies')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findCopies(@Param('id') id: string) {
    return this.physicalBooksService.findCopies(id);
  }

  @Post(':id/copies')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addCopies(@Param('id') id: string, @Body() dto: any) {
    return this.physicalBooksService.addCopies(id, dto);
  }

  @Patch('copies/:copyId')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateCopy(@Param('copyId') copyId: string, @Body() dto: any) {
    return this.physicalBooksService.updateCopy(copyId, dto);
  }

  @Delete('copies/:copyId')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  removeCopy(@Param('copyId') copyId: string) {
    return this.physicalBooksService.removeCopy(copyId);
  }

  @Get(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.physicalBooksService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updatePhysicalBookDto: UpdatePhysicalBookDto) {
    return this.physicalBooksService.update(id, updatePhysicalBookDto);
  }

  @Delete(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.physicalBooksService.remove(id);
  }
}
