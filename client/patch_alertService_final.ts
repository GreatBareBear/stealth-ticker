import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix URL encoding and prefixing
content = content.replace(
  "const symbols = visibleStocks.map((s) => s.symbol.toLowerCase()).join(',')",
  `const symbols = visibleStocks.map((s) => {
        let sym = s.symbol.toLowerCase().trim()
        if (/^\\d{6}$/.test(sym)) {
          sym = (sym.startsWith('6') ? 'sh' : 'sz') + sym
        }
        return encodeURIComponent(sym)
      }).join(',')`
);

// 2. Fix parseResponse match and length
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

// 3. Fix checkAlerts
content = content.replace(
  "const data = newData[stock.symbol] || newData[stock.symbol.toLowerCase()] || newData[stock.symbol.toUpperCase()]",
  "const cleanSymbol = stock.symbol.trim(); const data = newData[cleanSymbol] || newData[cleanSymbol.toLowerCase()] || newData[cleanSymbol.toUpperCase()]"
);

fs.writeFileSync(file, content);
