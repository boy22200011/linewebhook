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

  async getGroupName(groupId: string): Promise<string> {
    const result = await this.client.getGroupSummary(groupId)
    return result.groupName
  }

  async sendMessage(userId: string, message: string): Promise<void> {
    await this.client.pushMessage(userId, {
      type: "text",
      text: message
    })
  }

  async handleEvent(events: WebhookEvent[]): Promise<any> {
    for (let event of events) {
      /**
       * line 監聽事件
       */
      if (event.type === "postback") {
        // await this.client.replyMessage(event.replyToken, {
        //   type: "template",
        //   altText: `這是範例的 Buttons 模板訊息`,
        //   template: {
        //     type: "buttons",
        //     title: "前往官網",
        //     text: "請點選",
        //     actions: [
        //       {
        //         type: "uri",
        //         label: "前往網站",
        //         uri: "https://www.microsys.com.tw/"
        //       }
        //     ]
        //   }
        // })
      }
      // 私人加機器人的
      // source.userId: U4f0a2421ca47a3c950426d8dc8e3d51a

      // user在群組裡 機器人監聽到的
      // source.groupId: C38949b21b2752abd16f72a90e5829549
      // source.userId: U4f0a2421ca47a3c950426d8dc8e3d51a
      if (event.type === "message") {
        if (event.message.type === "text") {
          if (event.message.text.startsWith("@請假")) {
            await this.client.replyMessage(event.replyToken, {
              type: "template",
              altText: `永億資訊請假清單`,
              template: {
                type: "buttons",
                title: "請假",
                text: "-",
                actions: [
                  {
                    type: "uri",
                    label: "請假",
                    uri: "https://www.microsys.com.tw/"
                  }
                ]
              }
            })
          }
          if (event.message.text.startsWith("@打卡")) {
            await this.client.replyMessage(event.replyToken, {
              type: "template",
              altText: `永億資訊遠距打卡`,
              template: {
                type: "buttons",
                title: "打卡",
                text: "-",
                actions: [
                  {
                    type: "uri",
                    label: "打卡",
                    uri: "https://www.microsys.com.tw/"
                  }
                ]
              }
            })
          }
        }
      }
    }
  }
}
