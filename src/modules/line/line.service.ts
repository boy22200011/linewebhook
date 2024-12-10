import { Injectable } from "@nestjs/common"

import { Client, middleware, WebhookEvent } from "@line/bot-sdk"
@Injectable()
export class LineService {
  private client: Client
  constructor() {
    this.client = new Client({
      channelAccessToken:
        "C9goH1n+HkSZx9XUgG59NexdTP4HX8T4m7IomG2RZet7WKtjMtXE/gG84nJjwgiTSYJOFmWyDGpBvo32guzOFD2Fs2l0riMSzvhlYYi+EAICqMfECf2j1+6hIljUyr0hW6LuFvvbjCyVMY3g936c/gdB04t89/1O/w1cDnyilFU=",
      channelSecret: "db08565400fd1a27ab38b707dcefbdc3"
    })
  }

  async sendMessage(userId: string, message: string): Promise<void> {
    await this.client.pushMessage(userId, {
      type: "text",
      text: message
    })
  }

  async handleEvent(events: WebhookEvent[]): Promise<any> {
    for (let event of events) {
      if (event.type === "postback") {
        await this.client.replyMessage(event.replyToken, {
          type: "template",
          altText: `這是範例的 Buttons 模板訊息`,
          template: {
            type: "buttons",
            title: "前往官網",
            text: "請點選",
            actions: [
              {
                type: "uri",
                label: "前往網站",
                uri: "https://www.microsys.com.tw/"
              }
            ]
          }
        })
      }
      if (event.type === "message") {
        if (event.message.type === "text") {
          await this.client.replyMessage(event.replyToken, {
            type: "template",
            altText: `這是範例的 Buttons 模板訊息`,
            template: {
              type: "buttons",
              title: "您好有問題請洽詢",
              text: "洽詢",
              actions: [
                {
                  type: "postback",
                  label: "前往官網",
                  data: "action=option1"
                }
              ]
            }
          })
        }
      }
    }
  }
}
