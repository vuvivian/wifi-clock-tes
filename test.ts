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


getWifiList()
  .then((networks) => {
    console.log('Available Wi-Fi networks:', networks);
  })
  .catch((err) => {
    console.error('Error retrieving Wi-Fi networks:', err);
  });