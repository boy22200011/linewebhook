import { Controller, Post, Body, Headers, Req } from "@nestjs/common"
import { LineService } from "./line.service"

import { Request } from "express"
import { validateSignature } from "@line/bot-sdk"

@Controller("line")
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Post("webhook")
  async webhook(@Body() body: any, @Headers() headers: any, @Req() request: Request): Promise<any> {
    const signature = headers["x-line-signature"]

    const bodyString = JSON.stringify(body)

    if (!validateSignature(bodyString, "db08565400fd1a27ab38b707dcefbdc3", signature)) {
      throw new Error("Invalid signature")
    }

    await this.lineService.handleEvent(body.events)
    return "OK"
  }
}
