const fs = require('fs');
const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  "this.mainWindow.webContents.send('stock-data-updated', newData)",
  "require('fs').appendFileSync('/tmp/alert.log', JSON.stringify(newData) + '\\n'); this.mainWindow.webContents.send('stock-data-updated', newData)"
);
fs.writeFileSync(file, content);
