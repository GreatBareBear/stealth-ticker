import * as fs from 'fs';
import * as https from 'https';

const url = 'https://qt.gtimg.cn/q=sz000333';
https.get(url, (response) => {
  let data = Buffer.alloc(0);
  response.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  response.on('end', () => {
    let text = '';
    try {
      const decoder = new TextDecoder('gbk');
      text = decoder.decode(data);
    } catch (e) {
      text = data.toString('utf8');
    }
    
    const lines = text.split('\n');
    const newData: Record<string, any> = {};
    lines.forEach((line) => {
      line = line.trim();
      if (!line) return;
      const match = line.match(/^v_(.*?)="(.*)";?$/);
      if (match) {
        const fullSymbol = match[1];
        const parts = match[2].split('~');
        if (parts.length > 10) {
          const stockInfo = {
            symbol: fullSymbol,
            name: parts[1],
            price: parts[3],
            changeAmt: parts[31] || '0',
            changePct: parts[32] || '0',
            high: parts[33] || '0',
            low: parts[34] || '0'
          };
          newData[fullSymbol] = stockInfo;
          console.log(stockInfo);
        } else {
          console.log("parts length <= 10:", parts.length);
        }
      } else {
        console.log("No match for line:", line);
      }
    });
    console.log(newData);
  });
});
