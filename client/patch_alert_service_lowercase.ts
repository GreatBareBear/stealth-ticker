import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

const targetUrl = `const symbols = visibleStocks.map((s) => {
        let sym = s.symbol.trim()
        if (/^\\d{6}$/.test(sym)) {
          sym = (sym.startsWith('6') ? 'sh' : 'sz') + sym
        }
        const lowerSym = sym.toLowerCase()
        if (lowerSym.startsWith('us')) {
          sym = 'us' + sym.slice(2).toUpperCase()
        } else if (lowerSym.startsWith('hk') || lowerSym.startsWith('sh') || lowerSym.startsWith('sz') || lowerSym.startsWith('bj')) {
          sym = lowerSym
        }
        return encodeURIComponent(sym)
      }).join(',')
      const url = \`https://qt.gtimg.cn/q=\${symbols}\``;

const replaceUrl = `const symbols = visibleStocks.map((s) => {
        let sym = s.symbol.trim().toLowerCase()
        if (/^\\d{6}$/.test(sym)) {
          sym = (sym.startsWith('6') ? 'sh' : 'sz') + sym
        }
        return encodeURIComponent(sym)
      }).join(',')
      const url = \`https://qt.gtimg.cn/q=\${symbols}\``;

if (content.includes(targetUrl)) {
  content = content.replace(targetUrl, replaceUrl);
  fs.writeFileSync(file, content);
  console.log("Successfully patched alertService.ts");
} else {
  console.log("Could not find target string in alertService.ts");
}
