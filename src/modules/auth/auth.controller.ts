import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() user: { username: string; password: string }) {
    return this.authService.login(user)
  }

  @Post("genKey")
  async genKey(
    @Body() info: { licencekey: string; machineInfo: { machineId: string; cpuSerial: string; diskSerial: string } }
  ) {
    const getSerialNumberData = await this.authService.getSerialNumber(info.licencekey)

    if (getSerialNumberData.status === 1) {
      return {
        code: 0,
        message: "此序號已使用"
      }
    }
    const ppeInfo = this.authService.genPPeId(info)
    return ppeInfo
  }

  // @Post("getTokenData")
  // async getTokenData(@Body() obj: { token: string }) {
  //   return await this.authService.getTokenData(obj.token)
  // }
}
