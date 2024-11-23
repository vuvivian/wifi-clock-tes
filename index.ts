/*
 * @Author: vuvivian
 * @Date: 2024-10-28 15:34:49 
 * @LastEditor: vuvivian
 * @LastEditTime: 2024-11-09 21:07:44
 */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const wifi = require('node-wifi');
const { spawn } = require('child_process');

// 日志文件路径
const logFilePath = path.join(__dirname, 'test.log');


// 1. 检索名称为【时光荏苒】的热点
// 2. 五分钟内持续检索，如果没找到就一直找，5分钟后没热点，抛出异常
// 3. 找到后 连接热点
// 3. 连接成功后，打开网页 http://192.168.4.1/
// 4. 输入用户名和密码
// 5. 点击提交
// 6. 等待一段时间以查看结果
// 7. 退出

// 重复执行上述7步 直到强行结束程序

const ssid = '时光荏苒'; // 热点名称
const username = '@Ruijie-sECF4'; // 替换为你的用户名
const password = 'xyjy804.'; // 替换为你的密码

// 初始化 wifi
wifi.init({
  iface: 'en0' // network interface, if you're not sure, it will be automatically detected
});
   
async function delayedExit() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true); // 5秒后解析Promise
    }, 8000); // 设置定时器为5000毫秒（5秒）
  });
}

async function connectToWifi() {
    // 1. 一直检索名称为【时光荏苒】的热点
    while (true) {
        const networks = await getWifiList();
        const hotspot = networks.find(net => net.ssid === ssid);

        if (hotspot) {
            logToFile(`找到热点: ${ssid}`);
            try {

                // 2. 连接热点
                await wifi.connect({ ssid, password: hotspot.password });
                logToFile(`连接热点: ${ssid}`);
                // 3. 打开网页
                const browser = await puppeteer.launch({ headless: false });
                const page = await browser.newPage();
                
                await page.goto('http://192.168.4.1/');

                // 4. 输入用户名和密码
                await page.click('div[class="toogle-ssid-btn"]');
                await page.type('input[id="ssid-input"]', username);
                await page.type('input[id="pwd"]', password);

                // 5. 点击提交
                await Promise.all([
                    page.click('button[class="save-button"]'),
                    // page.waitForNavigation({ waitUntil: 'networkidle0' }),
                ]);


                // 6. 等待一段时间以查看结果
                // const tipText = await page.waitForFunction(
                //   () => {
                //     const tipElement = page.waitForSelector('#tip');
                //     if (tipElement) {
                //       return tipElement.textContent;
                //     }
                //     return null;
                //   }
                // );

                // const res = await page.waitForFunction(() => {
                //   const element = page.querySelector('#tip');
                //   // 检查元素是否存在，并且包含特定的文本
                //   console.log('???????????????')
                //   return element !== null && element.textContent !== '';
                // }, {
                //   // 可选的超时时间，单位是毫秒
                //   pollingInterval: 100,
                //   // 其他可选参数，比如 pollingInterval，用于指定检查函数的间隔时间
                // });
          
                const shouldExit = await delayedExit(); // 等待5秒等待5秒查看结果

                // 7. 退出
                if (shouldExit) {
                    const ele = await page?.$('#tip');
                    logToFile(ele?.textContent || '查看结果');
                    logToFile('————————————————————————————————————————————————————————————————————————');
                    await browser.close();
                    break; // 如果5秒已过，则退出循环
                }
            } catch (error) {
                logToFile(`中途断开: ${error}`);
                break;
            }
            
        } else {
            console.log(`未找到热点: ${ssid}，重新尝试...`);
            logToFile('未找到热点, 重新尝试...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒再重试
        }
    }
}

function getWifiList() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('/usr/local/bin/python3', ['wifi_scan.py']);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python script exited with code ${code}`));
      } else {
        try {
          const networks = JSON.parse(output);
          resolve(networks);
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

// 写入日志的函数
function logToFile(message) {
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('写入日志文件时出错:', err);
    }
  });
}

(async () => {
    while (true) {
        await connectToWifi();
    }
})();


