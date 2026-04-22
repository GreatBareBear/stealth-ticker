import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("iconv-lite")) {
  content = content.replace("import { net } from 'electron'", "import { net } from 'electron'\nimport * as iconv from 'iconv-lite'");
}

const targetDecode = `            let text = ''
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
            this.consecutiveFailures = 0`;

const replacementDecode = `            const text = iconv.decode(data, 'gbk')
            const newData = this.parseResponse(text)

            // 1. Send data to renderer first, to ensure UI gets it even if alerts fail
            if (this.mainWindow && !this.mainWindow.isDestroyed()) {
              this.mainWindow.webContents.send('stock-data-updated', newData)
            }

            // 2. Check alerts
            this.checkAlerts(newData, stocks)

            // Reset failures on success
            this.consecutiveFailures = 0`;

if (content.includes(targetDecode)) {
  content = content.replace(targetDecode, replacementDecode);
} else {
  console.log("Could not find targetDecode!");
}

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

// Fix parseResponse
content = content.replace(
  /const match = line\.match\(\/\^v_\(\.\*\?\)=\"\(\.\*\)\";\?\$\/\)/,
  "const match = line.match(/^v_(.*?)=\"(.*)\";?$/)"
);

const parseTarget = `        if (parts.length > 10) {
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
        }`;
if (!content.includes(parseTarget)) {
  console.log("Parse target not found, replacing old one");
  const oldParseTarget = `        if (parts.length > 34) {
          const stockInfo = {
            symbol: fullSymbol,
            name: parts[1],
            price: parts[3],
            changeAmt: parts[31],
            changePct: parts[32],
            high: parts[33],
            low: parts[34]
          }
          newData[fullSymbol] = stockInfo
          newData[fullSymbol.toLowerCase()] = stockInfo
          newData[fullSymbol.toUpperCase()] = stockInfo
        }`;
  content = content.replace(oldParseTarget, parseTarget);
}

const checkAlertsTarget = "const data = newData[stock.symbol] || newData[stock.symbol.toLowerCase()] || newData[stock.symbol.toUpperCase()]";
const checkAlertsReplace = "const cleanSymbol = stock.symbol.trim(); const data = newData[cleanSymbol] || newData[cleanSymbol.toLowerCase()] || newData[cleanSymbol.toUpperCase()]";
content = content.replace(checkAlertsTarget, checkAlertsReplace);

fs.writeFileSync(file, content);
