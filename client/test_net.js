const { app, net } = require('electron');
app.whenReady().then(() => {
  const request = net.request('https://qt.gtimg.cn/q=sh601857');
  request.on('response', (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    response.on('data', (chunk) => {
      console.log(`BODY: ${chunk.length}`);
    });
    response.on('end', () => {
      console.log('No more data in response.');
      app.quit();
    });
  });
  request.on('error', (err) => {
    console.error('ERROR:', err);
    app.quit();
  });
  request.end();
});
