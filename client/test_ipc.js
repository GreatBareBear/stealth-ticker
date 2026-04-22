const { app, BrowserWindow } = require('electron');
app.whenReady().then(() => {
  const win = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });
  win.loadURL('data:text/html,<html><body><script>const { ipcRenderer } = require("electron"); ipcRenderer.on("stock-data-updated", (e, d) => console.log("DATA:", d));</script></body></html>');
  win.webContents.once('did-finish-load', () => {
    win.webContents.send('stock-data-updated', { test: 123 });
    setTimeout(() => app.quit(), 1000);
  });
});
