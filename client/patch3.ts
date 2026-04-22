import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace the entire response.on('end') block
content = content.replace(/response\.on\('end', \(\) => \{[\s\S]*?this\.scheduleNextPoll\(\)\s*\}\)/, `response.on('end', () => {
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
        })`);

// Ensure trim on the symbol inside poll()
content = content.replace(
  "const symbols = visibleStocks.map((s) => encodeURIComponent(s.symbol.toLowerCase().trim())).join(',')",
  "const symbols = visibleStocks.map((s) => encodeURIComponent(s.symbol.toLowerCase().trim())).join(',')"
);

fs.writeFileSync(file, content);
