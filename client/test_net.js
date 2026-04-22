const { app, net } = require('electron');
app.whenReady().then(() => {
  const request = net.request('https://qt.gtimg.cn/q=sh600519');
  request.on('response', (response) => {
    console.log('STATUS:', response.statusCode);
    let data = Buffer.alloc(0);
    response.on('data', (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    response.on('end', () => {
      console.log('DATA:', data.toString('utf8').slice(0, 50));
      app.quit();
    });
  });
  request.on('error', (err) => {
    console.error("ERROR", err);
    app.quit();
  });
  request.end();
});
