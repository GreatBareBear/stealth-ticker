import * as fs from 'fs';

const file = '/workspace/client/src/renderer/src/pages/Monitor.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure stock.symbol is trimmed and lowered correctly
content = content.replace(
  "const data = stockData[stock.symbol] || stockData[stock.symbol.toLowerCase()] || stockData[stock.symbol.toUpperCase()]",
  "const cleanSymbol = stock.symbol.trim(); const data = stockData[cleanSymbol] || stockData[cleanSymbol.toLowerCase()] || stockData[cleanSymbol.toUpperCase()]"
);

fs.writeFileSync(file, content);
