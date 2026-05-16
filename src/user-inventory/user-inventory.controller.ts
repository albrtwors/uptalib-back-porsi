import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UserInventoryService } from "./user-inventory.service";
import { CreateUserInventoryDto } from "./dto/create-user-inventory.dto";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../user/dto/user.dto";

@Controller("user-inventory")
export class UserInventoryController {
  constructor(private readonly userInventoryService: UserInventoryService) { }

  // @Roles(Role.SUPERADMIN, Role.ADMIN)
  // @UseGuards(RolesGuard)
  // @Post()
  // create(@Body() createUserInventoryDto: CreateUserInventoryDto) {
  //   return this.userInventoryService.create(createUserInventoryDto);
  // }

  // @Roles(Role.SUPERADMIN, Role.ADMIN)
  // @UseGuards(RolesGuard)
  // @Get()
  // findAll() {
  //   return this.userInventoryService.findAll();
  // }

  // @Roles(Role.SUPERADMIN, Role.ADMIN)
  // @UseGuards(RolesGuard)
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.userInventoryService.remove(+id);
  // }
}
