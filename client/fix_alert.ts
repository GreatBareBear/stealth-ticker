import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import { net } from 'electron'", "import { net } from 'electron'\nimport * as iconv from 'iconv-lite'");

const oldBlock = /try \{\s*let text = ''\s*try \{\s*const decoder = new TextDecoder\('gbk'\)\s*text = decoder\.decode\(data\)\s*\} catch \(e\) \{\s*text = data\.toString\('utf8'\)\s*\}\s*const newData = this\.parseResponse\(text\)\s*this\.checkAlerts\(newData, stocks\)\s*\/\/ 1\. Send data to renderer\s*if \(this\.mainWindow && !this\.mainWindow\.isDestroyed\(\)\) \{\s*this\.mainWindow\.webContents\.send\('stock-data-updated', newData\)\s*\}\s*\} catch \(err\) \{/m;

const newBlock = `try {
            const text = iconv.decode(data, 'gbk')
            const newData = this.parseResponse(text)
            
            // 1. Send data to renderer first, to ensure UI gets it even if alerts fail
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
              this.mainWindow.webContents.send('stock-data-updated', newData)
            }

            // 2. Check alerts
            this.checkAlerts(newData, stocks)
          } catch (err) {`;

content = content.replace(oldBlock, newBlock);

content = content.replace(/https:\/\/qt\.gtimg\.cn/g, "http://qt.gtimg.cn");

content = content.replace(
  "const symbols = visibleStocks.map((s) => encodeURIComponent(s.symbol.toLowerCase().trim())).join(',')",
  `const symbols = visibleStocks.map((s) => {
        let sym = s.symbol.toLowerCase().trim()
        if (/^\\d{6}$/.test(sym)) {
          sym = (sym.startsWith('6') ? 'sh' : 'sz') + sym
        }
        return encodeURIComponent(sym)
      }).join(',')`
);

fs.writeFileSync(file, content);
