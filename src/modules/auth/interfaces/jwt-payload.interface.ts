export interface JwtPayload {
  username: string // 用戶名
  sub: number // 用戶 ID（通常是唯一標識符）
}
