# Tewi-Mashimaro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![](https://img.shields.io/npm/v/@dctewi/tewi-mashimaro?label=%40dctewi%2Ftewi-mashimaro)](https://www.npmjs.com/package/@dctewi/tewi-mashimaro)

![](https://s-sh-2563-tewi-box.oss.dogecdn.com/img/github/tewi-mashimaro.png)

## 简介

Tewi-Mashimaro 是一个自部署的棉花糖（一种可以接受来自网友的匿名提问的站点）项目。

部署本项目之后，你可以得到一个独立的棉花糖站点。效果可以查看[这里](https://tewi.mashimaro.space)或者下方的截图。


## 部署

### 傻瓜式一键部署

本部署方式适用于非专业用户。

#### 1. 准备工作

1. 一台系统为 Ubuntu LTS 18.04 的服务器（可以在阿里、腾讯云等地购买，注意尽量使用香港服务器，大陆内服务器需要提前备案）
2. 一个用来绑定的域名（如果不会申请，可以邮件联系 dctewi@dctewi.com，我可以免费提供一个 *.mashimaro.space 域名的解析）

#### 2. 解析域名到服务器

1. 在你的域名服务商处，给域名添加一个 A 记录到服务器的 IP 地址（可以在域名服务商的文档中看到详细说明）

2. 通过 SSH 远程连接你的服务器，然后在 Shell 界面复制这行指令并按回车键：

   ```bash
   bash <(wget -O- https://raw.githubusercontent.com/DCTewi/TewiMashimaro/main/tools/ubuntu-install.sh)
   ```

3. 等待显示  `INSTALL FINISHED`，此时访问你的域名，就大功告成了！

#### 3. 需要注意的

1. 在安装结束的部分，会有一个形似：

   ```javascript
   {
     siteName: 'Tewi Mashimaro',
     description: '通过棉花糖来向我匿名提问!',
     headerImageUrl: '',
     frequencyLimitPerMinute: 6,
     pageCapacity: 5,
     adminCapacity: 10,
     adminKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
   }
   ```

   的回显，其中 `adminKey` 后面紧跟的部分是站点生成的后台随机密码，请妥善保存。点击网页最下方的⚡并输入密码即可进入后台。

   如果一开始忘记复制了，可以在 Shell 界面输入 `mashimaro-config` 来重新显示这些内容。

2. 可以通过编辑  `/home/mashimaro/config.json` 来更改站点的标题、导语以及首页图片等设置。

   通过 nano 来更改设置的方法：

   1. 在 Shell 中输入：

      ```bash
      sudo nano /home/mashimaro/config.json
      ```

   2. 在出现的文本编辑器中更改想要更改的内容。

   3. 依次按下 Ctrl + O, Enter, Ctrl + X 保存并退出，此时配置自动生效。

3. 可以通过以下指令检查更新：

   ```bash
   npm install -g @dctewi/tewi-mashimaro
   ```

### 自定义部署

本部署方式适用于专业用户。

1. 本项目依赖于 Node.js v14.x。

2. 通过 npm 全局安装：

   ```bash
   npm install -g @dctewi/tewi-mashimaro
   ```

3. 暴露的可执行接口有  `mashimaro` 和 `mashimaro-config`，前者为启动服务器，后者为查看配置文件。通过不带参数运行可以查看启动选项说明。

4. 通过守护进程确保服务器不间断运行即可，请自行配置 SSL 或反代服务器。如果使用反代，请使用 `--local` 启动选项来仅监听本地请求。

## 截图

主界面：

![](https://s-sh-2563-tewi-box.oss.dogecdn.com/img/github/tewi-mashimaro/screenshot-1.jpeg)

管理界面：

![](https://s-sh-2563-tewi-box.oss.dogecdn.com/img/github/tewi-mashimaro/screenshot-2.jpeg)

