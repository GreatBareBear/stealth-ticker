const { app, BrowserWindow, ipcMain } = require('electron')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 300,
    height: 200,
    frame: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false }
  })

  win.loadURL(`data:text/html,
    <html style="user-select:none; height: 100%; background: #ccc;">
    <body style="margin:0; height: 100%;">
      <h1>Drag me</h1>
      <script>
        const { ipcRenderer } = require('electron');
        let dragging = false;
        let mouseX = 0;
        let mouseY = 0;
        window.addEventListener('mousedown', (e) => {
          if (e.button === 0) {
            dragging = true;
            mouseX = e.screenX;
            mouseY = e.screenY;
          }
        });
        window.addEventListener('mousemove', (e) => {
          if (dragging) {
            const dx = e.screenX - mouseX;
            const dy = e.screenY - mouseY;
            mouseX = e.screenX;
            mouseY = e.screenY;
            ipcRenderer.send('move-window', { dx, dy });
          }
        });
        window.addEventListener('mouseup', () => { dragging = false; });
      </script>
    </body>
    </html>
  `)

  ipcMain.on('move-window', (e, { dx, dy }) => {
    const [x, y] = win.getPosition()
    win.setPosition(x + dx, y + dy)
  })

  setTimeout(() => app.quit(), 3000)
})
