import { Controller, Post, Body, UseGuards } from "@nestjs/common"
import { UsersService } from "./users.service"
import { AuthGuard } from "@nestjs/passport"
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("findOne")
  findOne(@Body() users: { id: number }) {
    return this.usersService.findOne(users.id)
  }
}
