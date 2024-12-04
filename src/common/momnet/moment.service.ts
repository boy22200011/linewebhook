/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common"

import moment from "moment"
@Injectable()
export class MomentService {
  get moment() {
    return moment
  }
}
