
exec('wdutil info', (error, stdout, stderr) => {
  if (error) {
      console.error(`执行错误: ${error.message}`);
      return;
  }
  if (stderr) {
      console.error(`错误信息: ${stderr}`);
      return;
  }
  // 处理输出
  const wifiList = stdout.trim().split('\n').map(line => line.trim());
  console.log('wifi',stdout.trim() , wifiList);
});