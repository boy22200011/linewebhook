/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common"

import * as _ from "lodash"
@Injectable()
export class LodashService {
  get _() {
    return _
  }
}
