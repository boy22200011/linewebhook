# How to Start

## 前置作業

必須先下載安裝node 並執行

``` shell
npm install pnpm
```

## 安裝&啟動

### 用pnpm安裝需要的package

``` shell
pnpm install
```

[預設啟動網址](http://localhost:5000)

## 啟動

``` shell
pnpm start
```

## 建置&部署

### 使用nginx的小伙

直接build專案 將dist底下的檔案copy到 執行目錄底下就好

``` shell
pnpm build:prod
```

### 使用docker的小伙

一般docker

``` shell
docker build .
```

使用docker compose

``` shell
docker-compose up -d
```

使用docker compose 2.X的(其實就沒依賴python然後指令少了dash)

``` shell
docker compose up -d
```
