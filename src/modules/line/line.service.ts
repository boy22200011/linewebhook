import { Injectable } from "@nestjs/common"
import {
  Client,
  WebhookEvent,
  MessageEvent,
  PostbackEvent,
  JoinEvent,
  LeaveEvent,
  TextEventMessage,
  ReplyableEvent
} from "@line/bot-sdk"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class LineService {
  private client: Client

  // 建構子，初始化 Line 客戶端並使用設定檔中的 token 和密鑰
  constructor(configService: ConfigService) {
    this.client = new Client({
      channelAccessToken: configService.get<string>("LINE_BOT_ACCESS_TOKEN"),
      channelSecret: configService.get<string>("LINE_BOT_SECRET")
    })
  }

  // 事件處理器映射表，用來處理不同的事件類型
  private readonly eventHandlers: Record<EventType, (event: WebhookEvent) => Promise<void>> = {
    [EventType.MESSAGE]: (event: MessageEvent) => this.messageHandler(event),
    [EventType.POSTBACK]: (event: PostbackEvent) => this.postBackHandler(event),
    [EventType.JOIN]: (event: JoinEvent) => this.joinGroupHandler(event),
    [EventType.LEAVE]: (event: LeaveEvent) => this.leaveGroupHandler(event)
  }

  // 指令處理器映射表，用來處理特定的文字指令
  private readonly commandHandler: Record<string, () => any> = {
    "@請假": () => this.leaveHandler(),
    "@打卡": () => this.clockInHandler(),
    "@綁定": () => this.bindHandler()
  }

  // 根據群組 ID 取得群組名稱
  private async getGroupName(groupId: string): Promise<string> {
    const result = await this.client.getGroupSummary(groupId)
    return result.groupName
  }

  // 發送文字訊息給指定的使用者
  async sendMessage(userId: string, message: string): Promise<void> {
    await this.client.pushMessage(userId, {
      type: "text",
      text: message
    })
  }

  // 處理進來的事件，將事件交給對應的處理器
  async handleEvent(events: WebhookEvent[]): Promise<any> {
    for (const event of events) {
      const handler = this.eventHandlers[event.type]
      if (handler) {
        await handler(event)
      }
    }
  }

  // 回覆訊息
  private async replyMessage(event: ReplyableEvent, options: any) {
    await this.client.replyMessage(event.replyToken, options)
  }

  // 處理文字訊息事件
  private async messageHandler(event: MessageEvent) {
    let options
    try {
      switch (event.message.type) {
        case MessageType.TEXT:
          options = await this.messageWithTextHandler(event.message)
          break
      }
      await this.replyMessage(event, options)
    } catch (err) {
      console.error("Message handler error:", err)
    }
  }

  // 處理 postback 事件
  private async postBackHandler(event: PostbackEvent) {
    console.log(event)
    // await this.replyMessage(event, this.createButtonTemplate())
  }

  // 進入群組事件的空處理器（未實作）
  private async joinGroupHandler(event: JoinEvent) {
    console.log("Line bot join group")
  }

  // 離開群組事件的空處理器（未實作）
  private async leaveGroupHandler(event: LeaveEvent) {
    console.log("Line bot leave group")
  }

  // 處理文字訊息並根據指令執行對應的處理
  private async messageWithTextHandler(message: TextEventMessage) {
    const handler = this.commandHandler[message.text]
    if (handler) {
      return await handler()
    }
  }

  // 處理「請假」指令並回傳按鈕模板訊息
  private async leaveHandler() {
    return {
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
    }
  }

  // 處理「打卡」指令並回傳按鈕模板訊息
  private async clockInHandler() {
    return {
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
    }
  }

  private async bindHandler() {
    return {
      type: "template",
      altText: `綁定註冊`,
      template: {
        type: "buttons",
        title: "與小威綁定",
        text: "-",
        actions: [
          {
            type: "postback",
            label: "確定"
          }
        ]
      }
    }
  }

  // 建立通用的按鈕模板訊息
  private createButtonTemplate() {
    return {
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
    }
  }
}

// 事件類型的枚舉
enum EventType {
  POSTBACK = "postback",
  MESSAGE = "message",
  JOIN = "join",
  LEAVE = "leave"
}

// 訊息類型的枚舉
enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  LOCATION = "location",
  STICKER = "sticker"
}
