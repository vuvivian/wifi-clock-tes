/*
 * @Author: vuvivian
 * @Date: 2024-10-28 15:34:49 
 * @LastEditor: vuvivian
 * @LastEditTime: 2024-10-28 15:34:49 
 */
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const wifi = require('node-wifi');
const { spawn } = require('child_process');

function getWifiList() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('/usr/bin/python3', ['wifi_scan.py']);

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
    }, 5000); // 设置定时器为5000毫秒（5秒）
  });
}

async function connectToWifi() {
    // 1. 一直检索名称为【时光荏苒】的热点
    while (true) {
        const networks = await getWifiList();
        console.log('networks', networks);
        const hotspot = networks.find(net => net.ssid === ssid);

        if (hotspot) {
            console.log(`找到热点: ${ssid}`);
            // 2. 连接热点
            await wifi.connect({ ssid, password: hotspot.password });
            console.log('连接成功');

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
            // await page.waitForTimeout(10000); // 等待5秒查看结果

            // todo  判断结果进行打印 成功就退出从新开始

            // 7. 退出
            const shouldExit = await delayedExit(); // 等待5秒
            if (shouldExit) {
              await browser.close();
              break; // 如果5秒已过，则退出循环
            }
          
        } else {
            console.log(`未找到热点: ${ssid}，重新尝试...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒再重试
        }
    }
}

(async () => {
    while (true) {
        await connectToWifi();
    }
})();


