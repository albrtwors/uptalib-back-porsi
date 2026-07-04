import { Controller, Get, Post, Body, UseGuards, NotFoundException, Req, Param, ParseIntPipe, Delete, Patch, Query } from '@nestjs/common';
import { BookService } from './books.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { deleteFile } from '../utils/deleteFile';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) { }

  @Get()
  findAll(@Query() query: any) {
    return this.bookService.findAll(query);
  }

  @Get('my-library')
  @UseGuards(JwtAuthGuard)
  getMyLibrary(@Req() req: any, @Query() query: any) {
    return this.bookService.getSavedBooks(req.user.userId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Post()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() data: { title: string; routepdf: string; pnfs?: string[]; authorIds?: string[];[key: string]: any }, @Req() req: any) {
    if (!data.routepdf) {
      throw new NotFoundException('La ruta o enlace del PDF es requerida');
    }

    console.log('Registrando libro multi-autor y multi-pnf en la BD:', data.title);
    return this.bookService.create(data, req);
  }

  @Delete(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const book = await this.bookService.findOne(id);

    if (!book) {
      throw new NotFoundException('El libro no existe');
    }

    const bucketName = 'pdfs';
    if (book.routepdf && book.routepdf.includes(`${bucketName}/`)) {
      const supabasePath = book.routepdf.split(`${bucketName}/`)[1];
      if (supabasePath) {
        try {
          await deleteFile(supabasePath, 'pdfs');
        } catch (error) {
          console.error('No se pudo borrar el archivo en Supabase:', error);
        }
      }
    }

    return this.bookService.delete(id, req);
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: { title?: string; routepdf?: string; pnfs?: string[]; authorIds?: string[];[key: string]: any },
    @Req() req: any
  ) {
    return this.bookService.edit(id, data, req);
  }

  @Get('verify-like/:bookId')
  @UseGuards(JwtAuthGuard)
  verifyLike(@Req() req: any, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.getVerifyLike(req.user.userId, bookId);
  }

  @Post('remove-like/:bookId')
  @UseGuards(JwtAuthGuard)
  removeLike(@Req() req: any, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.removeFromUser(req.user.userId, bookId);
  }

  @Post('save/:bookId')
  @UseGuards(JwtAuthGuard)
  save(@Req() req: any, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.saveToUser(req.user.userId, bookId);
  }
}