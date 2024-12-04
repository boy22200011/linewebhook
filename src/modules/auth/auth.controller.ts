import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() user: { username: string; password: string }) {
    return this.authService.login(user)
  }

  @Post("getTokenData")
  async getTokenData(@Body() obj: { token: string }) {
    return await this.authService.getTokenData(obj.token)
  }
}
