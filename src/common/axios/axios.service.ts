/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common"
import { HttpService } from "@nestjs/axios"
import { AxiosResponse } from "axios"
import { catchError } from "rxjs/operators"
import { Observable, throwError } from "rxjs"
@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {
    this.httpService.axiosRef.interceptors.request.use(
      (config) => {
        // config.headers["Authorization"] = "Bearer "
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.httpService.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        return throwError(() => new Error(error))
      }
    )
  }

  get(url: string): Observable<AxiosResponse> {
    return this.httpService.get(url).pipe(
      catchError((error) => {
        console.error("HTTP Error:", error)
        return throwError(() => new Error(error))
      })
    )
  }

  post(url: string, data: any): Observable<AxiosResponse> {
    return this.httpService.post(url, data).pipe(
      catchError((error) => {
        console.error("HTTP POST Error:", error)
        return throwError(() => new Error(error))
      })
    )
  }
}
