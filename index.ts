/*
 * @Author: vuvivian
 * @Date: 2024-10-28 15:34:49 
 * @LastEditor: vuvivian
 * @LastEditTime: 2024-10-28 15:34:49 
 */
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const wifi = require('node-wifi');
const wifiName = require('wifi-name');

  // 1. 检索名称为【时光荏苒】的热点
  // 2. 五分钟内持续检索，如果没找到就一直找，5分钟后没热点，抛出异常
  // 3. 找到后 连接热点
  // 3. 连接成功后，打开网页 http://192.168.4.1/
  // 4. 输入用户名和密码
  // 5. 点击提交
  // 6. 等待一段时间以查看结果
  // 7. 退出

  // 重复执行上述7步 直到强行结束程序

// 初始化 wifi
wifi.init({
    iface: 'en0' // network interface, if you're not sure, it will be automatically detected
});

wifiName().then(name => {
    console.log('wifi---', name);
}).catch(error => {
    console.error(`获取wifi名称失败: ${error}`);
});

// exec('wdutil info', (error, stdout, stderr) => {
//   if (error) {
//       console.error(`执行错误: ${error.message}`);
//       return;
//   }
//   if (stderr) {
//       console.error(`错误信息: ${stderr}`);
//       return;
//   }

//   // 处理输出
//   const wifiList = stdout.trim().split('\n').map(line => line.trim());
//   console.log('wifi',stdout.trim() , wifiList);
// });

// exec('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s', (error, stdout, stderr) => {
//   if (error) {
//       console.error(`执行错误: ${error.message}`);
//       return;
//   }
//   if (stderr) {
//       console.error(`错误信息: ${stderr}`);
//       return;
//   }

//   console.log(`输出信息: ${stdout}`);
  
//   // 处理输出
//   const wifiList = stdout.trim().split('\n').map(line => {
//       const parts = line.split(/\s+/);
//       return {
//           SSID: parts[0], // Wi-Fi 名称
//           BSSID: parts[1], // MAC 地址
//           RSSI: parts[2],  // 信号强度
//           CHANNEL: parts[3], // 信道
//           HT: parts[4],    // HT 支持
//           CC: parts[5],    // 国家代码
//           SECURITY: parts[6] // 安全性
//       };
//   });

//   console.log(wifiList);
// });

const ssid = '时光荏苒'; // 热点名称
const username = 'yourUsername'; // 替换为你的用户名
const password = 'xyjy804.'; // 替换为你的密码

async function connectToWifi() {
    // 1. 一直检索名称为【时光荏苒】的热点
    while (true) {
      wifi.scan()
        .then(networks => {
            console.log('扫描结果:', networks);
        })
        .catch(error => {
            console.error(`扫描失败: ${error}`);
        });
      
        const networks = await wifi.scan();
        console.log('networks', networks);
        const hotspot = networks.find(net => net.ssid === ssid);

        if (hotspot) {
            console.log(`找到热点: ${ssid}`);
            // 2. 连接热点
            await wifi.connect({ ssid, password: hotspot.password });
            console.log('连接成功');

            // 3. 打开网页
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('http://192.168.4.1/');

            // 4. 输入用户名和密码
            await page.type('input[name="username"]', username);
            await page.type('input[name="password"]', password);

            // 5. 点击提交
            await Promise.all([
                page.click('button[type="submit"]'),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
            ]);

            // 6. 等待一段时间以查看结果
            await page.waitForTimeout(5000); // 等待5秒查看结果

            // 7. 退出
            await browser.close();
            break; // 退出循环
        } else {
            console.log(`未找到热点: ${ssid}，重新尝试...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒再重试
        }
    }
}

(async () => {
    while (true) {
        // await connectToWifi();
        exec('networksetup -listallhardwareports', (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.error(`stderr: ${stderr}`);
        });
    }
})();


