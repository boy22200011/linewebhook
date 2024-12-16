import { Controller, Post, Body, Headers, Req } from "@nestjs/common"
import { LineService } from "./line.service"

import { Request } from "express"
import { validateSignature } from "@line/bot-sdk"

import { ConfigService } from "@nestjs/config"

@Controller("line")
export class LineController {
  private _lineSecret: string
  constructor(
    private readonly lineService: LineService,
    configService: ConfigService
  ) {
    this._lineSecret = configService.get<string>("LINE_BOT_SECRET")
  }

  @Post("webhook")
  async webhook(@Body() body: any, @Headers() headers: any, @Req() request: Request): Promise<any> {
    const signature = headers["x-line-signature"]

    const bodyString = JSON.stringify(body)

    if (!validateSignature(bodyString, this._lineSecret, signature)) {
      throw new Error("Invalid signature")
    }

    await this.lineService.handleEvent(body.events)
    return "OK"
  }
}
