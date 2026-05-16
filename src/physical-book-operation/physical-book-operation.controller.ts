import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { PhysicalBookOperationService } from './physical-book-operation.service';
import { CreatePhysicalBookOperationDto } from './dto/create-physical-book-operation.dto';
import { UpdatePhysicalBookOperationDto } from './dto/update-physical-book-operation.dto';
import { MakeLoanDto } from './dto/makeLoan.dto';
import { EntrieDto } from './dto/entrie-dto';
import { DropDto } from './dto/drop-dto';
import { LoanDto } from './dto/loan-dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('physical-book-operation')
export class PhysicalBookOperationController {
  constructor(private readonly physicalBookOperationService: PhysicalBookOperationService) { }

  @Get()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(@Query() quer: any) {
    return this.physicalBookOperationService.findAllOperations(quer);
  }

  //entries
  @Patch('entries')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addEntries(@Body() entriesDto: EntrieDto) {
    return this.physicalBookOperationService.addEntries(entriesDto)
  }

  @Patch('drops')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  addDrops(@Body() entriesDto: DropDto) {
    return this.physicalBookOperationService.addDrops(entriesDto)
  }


  //loan related
  @Post('loan')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  loan(@Body() makeLoanDto: LoanDto) {
    return this.physicalBookOperationService.loan(makeLoanDto);
  }

  @Patch('settle/:id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  settle(@Param('id') id) {
    console.log(id)
    return this.physicalBookOperationService.settle(id)
  }

  @Get('loan')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllLoans(@Query() query: any) {
    return this.physicalBookOperationService.findAllLoans(query)

  }


  @Get(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.physicalBookOperationService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updatePhysicalBookOperationDto: UpdatePhysicalBookOperationDto) {
    return this.physicalBookOperationService.update(+id, updatePhysicalBookOperationDto);
  }

  @Delete(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.physicalBookOperationService.remove(+id);
  }
}
