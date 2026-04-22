import * as fs from 'fs';

// index.ts
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

// Monitor.tsx
let monitorFile = '/workspace/client/src/renderer/src/pages/Monitor.tsx';
let monitorContent = fs.readFileSync(monitorFile, 'utf8');
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
