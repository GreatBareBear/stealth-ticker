const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  console.log(typeof BrowserWindow.prototype.startWindowDrag);
  app.quit();
});
