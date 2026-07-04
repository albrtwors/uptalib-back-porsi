import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PhysicalBooksService } from './physical-books.service';
import { CreatePhysicalBookDto } from './dto/create-physical-book.dto';
import { UpdatePhysicalBookDto } from './dto/update-physical-book.dto';
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

  @Get()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() query) {
    return this.physicalBooksService.findAll(query);
  }

  @Get(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return 'this.physicalBooksService.findOne(+id);'
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
