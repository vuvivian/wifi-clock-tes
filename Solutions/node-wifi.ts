const wifi = require('node-wifi');

// 初始化 wifi
wifi.init({
  iface: 'en0' // network interface, if you're not sure, it will be automatically detected
});

wifi.scan()
.then(networks => {
    console.log('扫描结果:', networks);
})
.catch(error => {
    console.error(`扫描失败: ${error}`);
});