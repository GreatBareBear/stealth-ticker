const text = 'v_sz000333="51~美的集团~000333~79.38~79.50~79.50~92349~47850~44499~79.32~9~79.31~7~79.30~62~79.29~44~79.28~31~79.37~21~79.40~5~79.41~1~79.43~1~79.44~2~~20260422120542~-0.12~-0.15~79.63~78.87~79.38/92349/731502923~92349~73150~0.13~13.74~~79.63~78.87~0.96~5440.83~6037.12~2.70~87.45~71.55~0.68~123~79.21~13.74~13.74~~~0.28~73150.2923~0.0000~0~ ~GP-A~1.57~2.44~5.05~19.69~7.31~83.17~67.83~3.45~6.94~2.27~6854151524~7605346973~67.21~8.72~6854151524~~~17.16~-0.18~~CNY~0~~79.23~349~";';

function parseResponse(text) {
  const lines = text.split('\n')
  const newData = {}
  lines.forEach((line) => {
    line = line.trim()
    if (!line) return
    const match = line.match(/^v_(.*?)="(.*)";?$/)
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
      }
    }
  })
  return newData
}

console.log(parseResponse(text));
