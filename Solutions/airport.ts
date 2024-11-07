const { exec } = require('child_process');
exec('networksetup -listallhardwareports', (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});




exec('/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -s', (error, stdout, stderr) => {
  if (error) {
      console.error(`执行错误: ${error.message}`);
      return;
  }
  if (stderr) {
      console.error(`错误信息: ${stderr}`);
      return;
  }

  console.log(`输出信息: ${stdout}`);
  
  // 处理输出
  const wifiList = stdout.trim().split('\n').map(line => {
      const parts = line.split(/\s+/);
      return {
          SSID: parts[0], // Wi-Fi 名称
          BSSID: parts[1], // MAC 地址
          RSSI: parts[2],  // 信号强度
          CHANNEL: parts[3], // 信道
          HT: parts[4],    // HT 支持
          CC: parts[5],    // 国家代码
          SECURITY: parts[6] // 安全性
      };
  });

  console.log(wifiList);
});