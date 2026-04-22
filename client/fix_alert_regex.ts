import * as fs from 'fs';
const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

const regex = /let text = ''\s*try \{\s*const decoder = new TextDecoder\('gbk'\)\s*text = decoder\.decode\(data\)\s*\} catch \(e\) \{\s*text = data\.toString\('utf8'\)\s*\}\s*const newData = this\.parseResponse\(text\)\s*\/\/ 1\. Send data to renderer\s*if \(this\.mainWindow && !this\.mainWindow\.isDestroyed\(\)\) \{\s*this\.mainWindow\.webContents\.send\('stock-data-updated', newData\)\s*\}\s*\/\/ 2\. Check alerts\s*this\.checkAlerts\(newData, stocks\)\s*\/\/ Reset failures on success\s*this\.consecutiveFailures = 0/;

const replacement = `const text = iconv.decode(data, 'gbk')
            const newData = this.parseResponse(text)

            // 1. Send data to renderer first, to ensure UI gets it even if alerts fail
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
              this.mainWindow.webContents.send('stock-data-updated', newData)
            }

            // 2. Check alerts
            this.checkAlerts(newData, stocks)

            // Reset failures on success
            this.consecutiveFailures = 0`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
