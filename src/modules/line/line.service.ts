import { Injectable } from "@nestjs/common"

import { Client, WebhookEvent, MessageEvent, PostbackEvent, JoinEvent, LeaveEvent } from "@line/bot-sdk"

import { ConfigService } from "@nestjs/config"
@Injectable()
export class LineService {
  private client: Client
  constructor(configService: ConfigService) {
    this.client = new Client({
      channelAccessToken: configService.get<string>("LINE_BOT_ACCESS_TOKEN"),
      channelSecret: configService.get<string>("LINE_BOT_SECRET")
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
      switch (event.type) {
        case EventType.MESSAGE:
          await this.messageHandler(event)
          break
        case EventType.POSTBACK:
          await this.postBackHandler(event)
          break
        case EventType.JOIN:
          await this.joinHandler(event)
          break
        case EventType.LEAVE:
          await this.leaveHandler(event)
          break
      }
    }
  }

  async messageHandler(event: MessageEvent) {
    // 私人加機器人的
    // source.userId: U4f0a2421ca47a3c950426d8dc8e3d51a
    // user在群組裡 機器人監聽到的
    // source.groupId: C38949b21b2752abd16f72a90e5829549
    // source.userId: U4f0a2421ca47a3c950426d8dc8e3d51a
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

  async postBackHandler(event: PostbackEvent) {
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

  async joinHandler(event: JoinEvent) {}

  async leaveHandler(event: LeaveEvent) {}
}

enum EventType {
  POSTBACK = "postback",
  MESSAGE = "message",
  JOIN = "join",
  LEAVE = "leave"
}
