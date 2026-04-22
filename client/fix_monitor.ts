import * as fs from 'fs';

let monitorFile = '/workspace/client/src/renderer/src/pages/Monitor.tsx';
let monitorContent = fs.readFileSync(monitorFile, 'utf8');

// Ensure stock.symbol is trimmed
monitorContent = monitorContent.replace(
  "const data = stockData[stock.symbol] || stockData[stock.symbol.toLowerCase()] || stockData[stock.symbol.toUpperCase()]",
  "const cleanSymbol = stock.symbol.trim(); const data = stockData[cleanSymbol] || stockData[cleanSymbol.toLowerCase()] || stockData[cleanSymbol.toUpperCase()]"
);

// Remove defaults
monitorContent = monitorContent.replace(
  /const DEFAULT_STOCKS: Stock\[\] = \[[\s\S]*?\]\s*\n/,
  ''
);

monitorContent = monitorContent.replace(
  "const currentStocks =\n        Array.isArray(storeStocks) && storeStocks.length > 0 ? storeStocks : DEFAULT_STOCKS",
  "const currentStocks = Array.isArray(storeStocks) ? storeStocks : []"
);
monitorContent = monitorContent.replace(
  "const currentStocks = Array.isArray(storeStocks) && storeStocks.length > 0 ? storeStocks : DEFAULT_STOCKS",
  "const currentStocks = Array.isArray(storeStocks) ? storeStocks : []"
);

fs.writeFileSync(monitorFile, monitorContent);

let indexFile = '/workspace/client/src/main/index.ts';
let indexContent = fs.readFileSync(indexFile, 'utf8');
indexContent = indexContent.replace(
  /const shouldInitStocks =[\s\S]*?if \(shouldInitStocks\) \{[\s\S]*?\}\s*\n/,
  `const shouldInitStocks = !Array.isArray(existingStocks)
  if (shouldInitStocks) {
    store.set('stocks', [])
  }\n`
);
fs.writeFileSync(indexFile, indexContent);

