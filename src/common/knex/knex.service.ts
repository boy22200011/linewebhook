/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common"
import knex from "knex"
import * as fs from "fs"

@Injectable()
export class KnexService {
  private knexInstance

  constructor() {
    const env = process.env.NODE_ENV || "development"
    const configFilePath = `config.${env}.json`
    const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"))
    // 根據你的資料庫配置進行修改
    this.knexInstance = knex(config.db.mysql)
  }

  // 返回 Knex 實例，讓其他服務可以使用它來執行 SQL 查詢
  get Knex() {
    return this.knexInstance
  }
}
