const https = require('https');

function parseResponse(text) {
  const lines = text.split('\n')
  const newData = {}
  lines.forEach((line) => {
    line = line.trim()
    if (!line) return
    const match = line.match(/^v_(.*?)="(.*)";$/)
    if (match) {
      const fullSymbol = match[1]
      const parts = match[2].split('~')
      if (parts.length > 34) {
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
      }
    }
  })
  return newData
}

https.get('https://qt.gtimg.cn/q=sh601857', (res) => {
  let data = Buffer.alloc(0);
  res.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  res.on('end', () => {
    const decoder = new TextDecoder('gbk');
    const text = decoder.decode(data);
    console.log("Raw text:", text.slice(0, 50), "...", text.slice(-50));
    console.log("Parsed:", parseResponse(text));
  });
});
