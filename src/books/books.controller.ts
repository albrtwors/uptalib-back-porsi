import { Controller, Get, Post, Body, UseGuards, NotFoundException, Req, Param, ParseIntPipe, Delete, Patch, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BookService } from './books.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Crea un guard sencillo que use AuthGuard('jwt')
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import path, { extname } from 'path';
import { randomUUID, UUID } from 'crypto';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { storageFor1File } from './utils/storage';
import { uploadFile } from '../utils/uploadFile';
import { deleteFile } from '../utils/deleteFile';
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) { }

  @Get() // Todos los logueados ven
  @UseGuards(JwtAuthGuard)
  findAll(@Query() query: any) {
    return this.bookService.findAll(query);
  }

  @Get('my-library') // Ver mis libros guardados
  @UseGuards(JwtAuthGuard)
  getMyLibrary(@Req() req: any, @Query() query: any) {
    return this.bookService.getSavedBooks(req.user.userId, query);
  }


  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }



  @Post()
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('pdf', { storage: memoryStorage() })) // 2. Forzar almacenamiento en memoria
  async create(
    @Body() data: any,
    @Req() req,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new Error('No se ha subido ningún archivo');
    }
    const sanitizedTitle = data.title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos si los hay
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_');

    const fileExt = path.extname(file.originalname) || '.pdf';
    const newFileName = `${sanitizedTitle}${fileExt}`;
    const finalPath = await uploadFile(file, 'pdfs', newFileName);
    console.log(finalPath)
    return this.bookService.create({ ...data, routepdf: finalPath }, req);
  }




  //accept=".pdf"

  @Delete(':id')
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {

    const book = await this.bookService.findOne(id);

    if (!book) {
      throw new NotFoundException('El libro no existe');
    }

    if (book && book.routepdf) {
      const bucketName = 'pdfs';

      // Extrae todo lo que esté después del nombre del bucket
      // "https://.../public/tu-bucket/pdfs/libro.pdf" -> "pdfs/libro.pdf"
      const supabasePath = book.routepdf.split(`${bucketName}/`)[1];

      if (supabasePath) {
        // Llamamos a la función de eliminación en la nube
        await deleteFile(supabasePath, 'pdfs');
      }
    }



    return this.bookService.delete(id, req);
  }


  @Patch(':id') // Solo ADMIN actualiza
  @Roles(Role.LIBRARIAN, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('pdf', { storage: memoryStorage() })) // 2. Forzar almacenamiento en memoria
  async edit(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @UploadedFile() pdfFile: Express.Multer.File, @Req() req: any

  ) {
    // Obtener el libro existente para eliminar archivos antiguos
    const existingBook = await this.bookService.findOne(id);

    if (!existingBook) {
      throw new NotFoundException('El libro no existe');
    }

    // Preparar datos para actualizar
    let updateData: any = data;

    if (pdfFile) {
      const sanitizedTitle = existingBook.title != data.title ? data.title : existingBook.title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos si los hay
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_');

      const fileExt = path.extname(pdfFile.originalname) || '.pdf';
      const newFileName = `${sanitizedTitle}${fileExt}`;
      const finalPath = await uploadFile(pdfFile, 'pdfs', newFileName);
      updateData = { ...data, routepdf: finalPath };
    }

    return this.bookService.edit(id, updateData, req);
  }



  @Get('verify-like/:bookId')
  @UseGuards(JwtAuthGuard)
  verifyLike(@Req() req, @Param('bookId', ParseIntPipe) bookId) {
    return this.bookService.getVerifyLike(req.user.userId, bookId)
  }

  @Post('remove-like/:bookId')
  @UseGuards(JwtAuthGuard)
  removeLike(@Req() req, @Param('bookId', ParseIntPipe) bookId) {
    return this.bookService.removeFromUser(req.user.userId, bookId)
  }





  @Post('save/:bookId') // El usuario guarda un libro en su lista
  @UseGuards(JwtAuthGuard)
  save(@Req() req, @Param('bookId', ParseIntPipe) bookId: number) {
    return this.bookService.saveToUser(req.user.userId, bookId);
  }


}