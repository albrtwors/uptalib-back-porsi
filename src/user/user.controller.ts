import { Controller, Post, Body, Patch, Param, ParseIntPipe, UseGuards, Get, Req, Query } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto, Role } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';

/* PROBANDO COMENTARIO EN LA BRANCH NUEVA */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get('')
  findAll(@Query() query) {
    return this.usersService.findAll(query)
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateMe(
    @GetUser('userId') userId: number,
    @Body() updateDto: { name?: string; email?: string; password?: string }
  ) {
    return this.usersService.updateMe(userId, updateDto);
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser('userId') userId: number) {
    return this.usersService.findOne(userId);
  }

  @Get('role')
  @UseGuards(JwtAuthGuard)
  async getUserRole(@Req() req) {
    const userId = req.user.userId

    return this.usersService.getUserRole(userId)
  }

  @Patch('block/:id')
  @Roles(Role.ADMIN)
  blockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.blockUser(id)
  }

  @Patch('unblock/:id')
  @Roles(Role.ADMIN)
  unBlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unBlockUser(id)
  }

  @Patch('role/:id')
  @UseGuards(JwtAuthGuard)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: Role,
  ) {
    return this.usersService.updateRole(id, role);
  }
}