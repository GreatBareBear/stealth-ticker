const { app } = require('electron');
app.whenReady().then(() => {
  try {
    const td = new TextDecoder('gbk');
    console.log("SUCCESS");
  } catch (e) {
    console.error("ERROR", e);
  }
  app.quit();
});
