import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Add iconv-lite import at the top
if (!content.includes("import * as iconv from 'iconv-lite'")) {
  content = content.replace("import { net } from 'electron'", "import { net } from 'electron'\nimport * as iconv from 'iconv-lite'");
}

// 2. Change url and add prefixing
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

content = content.replace(
  /const url = `https:\/\/qt\.gtimg\.cn\/q=\$\{symbols\}`/,
  "const url = `http://qt.gtimg.cn/q=${symbols}`"
);

// 3. Fix the decoding logic
const targetDecode = `          try {
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
          }`;

const replacementDecode = `          try {
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
          }`;

content = content.replace(targetDecode, replacementDecode);

// 4. Also fix the old fallback code if the target wasn't found (because I rolled back)
const targetDecodeOld = `          const decoder = new TextDecoder('gbk')
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
          this.scheduleNextPoll()`;

content = content.replace(targetDecodeOld, replacementDecode);


// 5. Update parseResponse to allow missing semicolons and >10 parts
content = content.replace(
  /const match = line\.match\(\/\^v_\(\.\*\?\)=\"\(\.\*\)\";\$\/\)/,
  "const match = line.match(/^v_(.*?)=\"(.*)\";?$/)"
);

content = content.replace(
  /if \(parts\.length > 34\) \{[\s\S]*?newData\[fullSymbol\.toUpperCase\(\)\] = stockInfo\s*\}/,
  `if (parts.length > 10) {
          const stockInfo = {
            symbol: fullSymbol,
            name: parts[1],
            price: parts[3],
            changeAmt: parts[31] || '0',
            changePct: parts[32] || '0',
            high: parts[33] || '0',
            low: parts[34] || '0'
          }
          newData[fullSymbol] = stockInfo
          newData[fullSymbol.toLowerCase()] = stockInfo
          newData[fullSymbol.toUpperCase()] = stockInfo

          const codeOnly = parts[2]
          if (codeOnly) {
            newData[codeOnly] = stockInfo
            newData[codeOnly.toLowerCase()] = stockInfo
            newData[codeOnly.toUpperCase()] = stockInfo
          }
        }`
);

// 6. Ensure Monitor checkAlerts uses trim()
content = content.replace(
  "const data = newData[stock.symbol] || newData[stock.symbol.toLowerCase()] || newData[stock.symbol.toUpperCase()]",
  "const cleanSymbol = stock.symbol.trim(); const data = newData[cleanSymbol] || newData[cleanSymbol.toLowerCase()] || newData[cleanSymbol.toUpperCase()]"
);

fs.writeFileSync(file, content);
