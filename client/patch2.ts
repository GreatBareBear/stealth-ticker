import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

// remove the fs.appendFileSync
content = content.replace("require('fs').appendFileSync('/tmp/alert.log', JSON.stringify(newData) + '\\n'); ", "");

const target = `        response.on('end', () => {
          clearTimeout(reqTimeout)
          const decoder = new TextDecoder('gbk')
          const text = decoder.decode(data)
          const newData = this.parseResponse(text)

          // 1. Send data to renderer
          if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('stock-data-updated', newData)
          }

          // 2. Check alerts
          this.checkAlerts(newData, stocks)

          // Reset failures on success
          this.consecutiveFailures = 0
          this.scheduleNextPoll()
        })`;

const replacement = `        response.on('end', () => {
          clearTimeout(reqTimeout)
          try {
            let text = ''
            try {
              const decoder = new TextDecoder('gbk')
              text = decoder.decode(data)
            } catch (e) {
              text = data.toString('utf8')
            }
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
        })`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
