import { Injectable } from "@nestjs/common"
import {
  Client,
  WebhookEvent,
  MessageEvent,
  PostbackEvent,
  JoinEvent,
  LeaveEvent,
  TextEventMessage,
  EventSource
} from "@line/bot-sdk"
import { ConfigService } from "@nestjs/config"
import { CryptoService } from "../../common/crypto/crypto.service"
import { KnexService } from "../../common/knex/knex.service"
@Injectable()
export class LineService {
  private client: Client

  // 建構子，初始化 Line 客戶端並使用設定檔中的 token 和密鑰
  constructor(
    configService: ConfigService,
    private readonly cryptoService: CryptoService,
    private readonly knexService: KnexService
  ) {
    this.client = new Client({
      channelAccessToken: configService.get<string>("LINE_BOT_ACCESS_TOKEN"),
      channelSecret: configService.get<string>("LINE_BOT_SECRET")
    })
  }

  // 事件處理器映射表，用來處理不同的事件類型
  private readonly eventHandlers: Record<EventType, (event: WebhookEvent) => Promise<void>> = {
    [EventType.MESSAGE]: (event: WebhookEvent & MessageEvent) => this.messageHandler(event),
    [EventType.POSTBACK]: (event: WebhookEvent & PostbackEvent) => this.postBackHandler(event),
    [EventType.JOIN]: (event: WebhookEvent & JoinEvent) => this.joinGroupHandler(event),
    [EventType.LEAVE]: (event: WebhookEvent & LeaveEvent) => this.leaveGroupHandler(event)
  }

  // 指令處理器映射表，用來處理特定的文字指令
  private readonly commandHandler: Record<string, (event: WebhookEvent & MessageEvent) => any> = {
    "@技安註冊工地": (event) => this.bindHandler(event)
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
  private async replyMessage(event: WebhookEvent & MessageEvent, options: any) {
    await this.client.replyMessage(event.replyToken, options)
  }

  // 處理文字訊息事件
  private async messageHandler(event: WebhookEvent & MessageEvent) {
    let options
    try {
      switch (event.message.type) {
        case MessageType.TEXT:
          options = await this.messageWithTextHandler(event, event.message)
          break
        default:
          return
      }
      await this.replyMessage(event, options)
    } catch (err) {
      console.error("Message handler error:", err)
    }
  }

  // 處理 postback 事件
  private async postBackHandler(event: WebhookEvent & PostbackEvent) {
    console.log(event)
    // await this.replyMessage(event, this.createButtonTemplate())
  }

  // 進入群組事件的空處理器
  private async joinGroupHandler(event: WebhookEvent & JoinEvent) {
    const source: EventSource = event.source
    if (source.type === "group") {
      const groupName = await this.getGroupName(source.groupId)
      const knex = this.knexService.getKnex()

      const getLineGroup = await knex("LineGroup").select({ id: "ID" }).where("LineGroupID", source.groupId).limit(1)

      if (getLineGroup.length > 0) {
        await knex("LineGroup").update({ GroupName: groupName, Status: 1 }).where("ID", getLineGroup[0].id)
      } else {
        await knex("LineGroup").insert({ GroupName: groupName, LineGroupID: source.groupId, Status: 1 })
      }
    }
  }

  // 離開群組事件的空處理器
  private async leaveGroupHandler(event: WebhookEvent & LeaveEvent) {
    const source: EventSource = event.source
    if (source.type === "group") {
      const knex = this.knexService.getKnex()
      // 群組關閉
      await knex("LineGroup")
        .update({
          Status: 0
        })
        .where("LineGroupID", source.groupId)
    }
  }

  // 處理文字訊息並根據指令執行對應的處理
  private async messageWithTextHandler(event: WebhookEvent & MessageEvent, textEventMessage: TextEventMessage) {
    const handler = this.commandHandler[textEventMessage.text]
    if (handler) {
      // 有在指令陣列
      return await handler(event)
    } else {
      const source: EventSource = event.source

      if (source.type === "group") {
        // 來自群組
      } else if (source.type === "user") {
        // 單純訊息
        const message = textEventMessage.text

        try {
          const regex = /^PPEID:\s*(\S+)$/

          const match = message.match(regex)

          if (match) {
            const ppeid = match[1]

            // ppeid 驗證是否合法
            const encry_ppeid = this.cryptoService.decrypt(ppeid)

            const jsonObj = JSON.parse(encry_ppeid)
            // TODO: DB操作
            const knex = this.knexService.getKnex()

            // 檢查序號存不存在
            const checkSerialNumber = await knex("SerialNumberList")
              .select({ id: "ID", status: "Status" })
              .where("SerialNumber", jsonObj.licencekey)

            if (checkSerialNumber.length <= 0) {
              await this.replyMessage(event, { type: "text", text: `PPEID不正確` })
            }

            if (checkSerialNumber[0].status === 1) {
              await this.replyMessage(event, { type: "text", text: `序號已使用` })
            }

            // 找尋回應人群組並跟序號做綁定
            const getLineUser = await knex("LineUsers")
              .select({ id: "ID", lineGroupID: "LineGroupID" })
              .where("LineUserID", event.source.userId)
              .limit(1)

            if (getLineUser.length <= 0) await this.replyMessage(event, { type: "text", text: `使用者不存在` })

            const getLineGroup = await knex("LineGroup")
              .select({ id: "ID" })
              .where("LineGroupID", getLineUser[0].lineGroupID)

            if (getLineGroup.length <= 0) await this.replyMessage(event, { type: "text", text: `找不到所在群組` })

            // 由於DB已設定 GroupID and SerialID是複合索引 所以重複一定會錯
            // 1,1 就不能在新增 1,1
            await knex("LineGroupAndSerialMapping").insert({
              GroupID: getLineGroup[0].id,
              SerialID: checkSerialNumber[0].id
            })
            // 更新資料庫 將序號標記啟用
            await knex("SerialNumberList")
              .update({
                Status: 1,
                MachineInfo: JSON.stringify(jsonObj.machineInfo)
              })
              .where("SerialNumber", jsonObj.licencekey)

            // 回應綁定成功
            await this.replyMessage(event, { type: "text", text: `綁定成功` })
          } else {
            return this.replyInvalidFormat(event)
          }
        } catch (err) {
          await this.replyMessage(event, { type: "text", text: `綁定失敗` })
        }
      } else {
        // 無法確定來源
        // TODO: 這邊可以寫log
      }
    }
  }

  private async bindHandler(event: WebhookEvent & MessageEvent) {
    const source: EventSource = event.source

    // 先判斷是不是群組
    if (source.type === "group") {
      // 來自群組
      // 紀錄打指令的人
      const knex = this.knexService.getKnex()

      const getLineUsers = await knex("LineUsers")
        .select({
          id: "ID",
          lineUserId: "LineUserID"
        })
        .where("LineUserID", event.source.userId)
        .limit(1)

      if (getLineUsers.length <= 0) {
        await knex("LineUsers").insert({
          LineGroupID: source.groupId,
          LineUserID: event.source.userId
        })
      }

      // 發送給個人
      await this.client.pushMessage(event.source.userId, {
        type: "text",
        text: "請輸入PPEID，格式: PPEID: XXXXXX"
      })
    } else if (source.type === "user") {
      // // 來自個人
      // await this.client.pushMessage(event.source.userId, {
      //   type: "text",
      //   text: "請輸入PPEID，格式: PPEID: XXXXXX"
      // })
    } else {
      // 無法確定來源
      // TODO: 這邊可以寫log
    }
  }

  private async replyInvalidFormat(event: WebhookEvent & MessageEvent) {
    return this.replyMessage(event, { type: "text", text: `請輸入正確的格式，例如 "PPEID: XXXXX"` })
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
