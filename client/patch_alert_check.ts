import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

// Ensure stock.symbol is trimmed
content = content.replace(
  "const data = newData[stock.symbol] || newData[stock.symbol.toLowerCase()] || newData[stock.symbol.toUpperCase()]",
  "const cleanSymbol = stock.symbol.trim(); const data = newData[cleanSymbol] || newData[cleanSymbol.toLowerCase()] || newData[cleanSymbol.toUpperCase()]"
);

fs.writeFileSync(file, content);
