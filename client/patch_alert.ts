import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix URL encoding
content = content.replace(
  "const symbols = visibleStocks.map((s) => s.symbol.toLowerCase()).join(',')",
  "const symbols = visibleStocks.map((s) => encodeURIComponent(s.symbol.toLowerCase().trim())).join(',')"
);

// 2. Fix TextDecoder and try-catch in response.on('end')
content = content.replace(
  /response\.on\('end', \(\) => \{\s*clearTimeout\(reqTimeout\)\s*const decoder = new TextDecoder\('gbk'\)\s*const text = decoder\.decode\(data\)\s*const newData = this\.parseResponse\(text\)\s*this\.checkAlerts\(newData, stocks\)\s*if \(this\.mainWindow && !this\.mainWindow\.isDestroyed\(\)\) \{\s*this\.mainWindow\.webContents\.send\('stock-data-updated', newData\)\s*\}\s*this\.scheduleNextPoll\(\)\s*\}\)/,
  `response.on('end', () => {
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
            this.checkAlerts(newData, stocks)

            // 1. Send data to renderer
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
              this.mainWindow.webContents.send('stock-data-updated', newData)
            }
          } catch (err) {
            console.error('Failed to parse response:', err)
          } finally {
            this.scheduleNextPoll()
          }
        })`
);

// 3. Fix parseResponse
content = content.replace(
  /const match = line\.match\(\/\^v_\(\.\*\?\)=\"\(\.\*\)\";\$\/\)\s*if \(match\) \{\s*const fullSymbol = match\[1\]\s*const parts = match\[2\]\.split\('~'\)\s*if \(parts\.length > 34\) \{[\s\S]*?newData\[fullSymbol\.toUpperCase\(\)\] = stockInfo\s*\}/,
  `const match = line.match(/^v_(.*?)="(.*)";?$/)
      if (match) {
        const fullSymbol = match[1]
        const parts = match[2].split('~')
        if (parts.length > 10) {
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

fs.writeFileSync(file, content);
