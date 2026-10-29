import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreatePnfDto } from './dto/create-pnf.dto';
import { UpdatePnfDto } from './dto/update-pnf.dto';
import { PnfService } from './pnf.service';

@Controller('pnf')
export class PnfController {
  constructor(private readonly pnfService: PnfService) {}

  @Post()
  create(@Body() createPnfDto: CreatePnfDto) {
    return this.pnfService.create(createPnfDto);
  }

  @Get()
  findAll(@Query() query) {
    return this.pnfService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pnfService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePnfDto: UpdatePnfDto) {
    return this.pnfService.update(id, updatePnfDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pnfService.remove(id);
  }
}
