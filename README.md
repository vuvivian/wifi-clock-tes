## 背景

Apple used to provide a binary called airport at the following location -/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport

This was able to scan for and produce a list of available SSIDs 
Unfortunately as of macOS Sonoma 14.4 this tool is now deprecated and if executed only displays the following error message.

WARNING: The airport command line tool is deprecated and will be removed in a future release. For diagnosing Wi-Fi related issues, use the Wireless Diagnostics app or wdutil command line tool.

It goes without saying that neither of the referred to tools is a suitable substitute.

## 解决方案

### CoreWLAN

CoreWLAN 是 macOS 上的原生 Objective-C 框架，用于管理 Wi-Fi 网络，但它并不是一个标准的 Python 库，因此无法直接在 Python 中导入。要在 Python 中使用 CoreWLAN，可以借助 PyObjC，一个桥接库，允许 Python 调用 macOS 的 Objective-C 框架。

### PyObjC

PyObjC 是一个 Python 库，它允许 Python 开发者调用 Objective-C 代码和与 Objective-C 框架进行交互。Objective-C 是苹果的 macOS 和 iOS 操作系统的主要编程语言，而 PyObjC 则提供了一种方便的方式来使用 Python 调用 Objective-C 代码。


### spawn函数

spawn函数用于异步地执行外部命令，并返回一个新的ChildProcess实例。

与exec函数相比，spawn更加灵活，因为它允许直接从子进程的stdout和stderr流中读取数据，而不是在命令执行完毕后一次性获取全部输出。


### Puppeteer

Puppeteer 是一个 Node.js 库，它提供了一个高级 API 来控制 Chrome 或 Chromium 浏览器。它允许你通过 JavaScript 代码来自动化浏览器操作，例如：
- 生成页面 PDF。
- 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
- 测试浏览器扩展。

