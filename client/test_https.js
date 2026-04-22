const { app, net } = require('electron');
const iconv = require('iconv-lite');
app.whenReady().then(() => {
  const request = net.request('https://qt.gtimg.cn/q=sh601857');
  request.on('response', (response) => {
    let data = Buffer.alloc(0);
    response.on('data', (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    response.on('end', () => {
      const text = iconv.decode(data, 'gbk');
      console.log(text.slice(0, 20));
      app.quit();
    });
  });
  request.on('error', (err) => {
    console.error("ERROR", err);
    app.quit();
  });
  request.end();
});
