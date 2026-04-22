import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('iconv-lite')) {
  content = content.replace("import { net } from 'electron'", "import { net } from 'electron'\nimport * as iconv from 'iconv-lite'");
}

content = content.replace(/response\.on\('end', \(\) => \{[\s\S]*?this\.scheduleNextPoll\(\)\s*\}\)/,
`response.on('end', () => {
          clearTimeout(reqTimeout)
          try {
            const text = iconv.decode(data, 'gbk')
            const newData = this.parseResponse(text)

            // 1. Send data to renderer
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
              this.mainWindow.webContents.send('stock-data-updated', newData)
            }

            // 2. Check alerts
            this.checkAlerts(newData, stocks)

            // Reset failures on success
            this.consecutiveFailures = 0
          } catch (err) {
            console.error('Failed to parse response:', err)
            this.consecutiveFailures++
          } finally {
            this.scheduleNextPoll()
          }
        })`);

content = content.replace(/http:\/\/qt\.gtimg\.cn/g, "https://qt.gtimg.cn");

const targetUrl = "const symbols = visibleStocks.map((s) => encodeURIComponent(s.symbol.toLowerCase().trim())).join(',')";
const replaceUrl = `const symbols = visibleStocks.map((s) => {
        let sym = s.symbol.toLowerCase().trim()
        if (/^\\d{6}$/.test(sym)) {
          sym = (sym.startsWith('6') ? 'sh' : 'sz') + sym
        }
        return encodeURIComponent(sym)
      }).join(',')`;

if (content.includes(targetUrl)) {
  content = content.replace(targetUrl, replaceUrl);
}

fs.writeFileSync(file, content);
