const fs = require('fs');

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

const text = 'v_sh601857="1~中国石油~601857~11.44~11.47~11.49~491117~236557~254560~11.44~1757~11.43~8971~11.42~9779~11.41~5924~11.40~12339~11.45~264~11.46~4494~11.47~11890~11.48~10650~11.49~9645~~20260422113916~-0.03~-0.26~11.51~11.42~11.44/491117/562826483~491117~56283~0.03~13.31~~11.51~11.42~0.78~18523.89~20937.60~1.32~12.62~10.32~0.69~1827~11.46~13.31~13.31~~~-0.13~56282.6483~0.0000~0~ ~GP-A~9.89~-2.72~4.11~9.92~6.08~13.69~7.42~-4.51~-4.59~16.50~161922077818~183020977818~2.41~31.19~161922077818~~~51.72~-0.09~~CNY~0~___D__F__N~11.50~-18155~";\n';
console.log(parseResponse(text));
