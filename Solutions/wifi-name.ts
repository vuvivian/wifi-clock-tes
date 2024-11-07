const wifiName = require('wifi-name');

wifiName().then(name => {
  console.log('wifi---', name);
}).catch(error => {
  console.error(`获取wifi名称失败: ${error}`);
});