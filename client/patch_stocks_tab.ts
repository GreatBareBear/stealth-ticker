import * as fs from 'fs';

const file = '/workspace/client/src/renderer/src/components/settings/StocksTab.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `          const newOptions = items.map((item) => {
            const parts = item.split('~')
            const exchange = parts[0]
            const code = parts[1]
            const name = parts[2]
            const type = parts[4]

            const symbol = \`\${exchange}\${code}\`
            return {
              value: symbol,
              label: \`\${name} (\${symbol})\`,
              data: { symbol, name, type }
            }`;

const replace = `          const newOptions = items.map((item) => {
            const parts = item.split('~')
            const exchange = parts[0]
            let code = parts[1]
            const name = parts[2]
            const type = parts[4]

            if (exchange === 'us') {
              code = code.split('.')[0].toUpperCase()
            }

            const symbol = \`\${exchange}\${code}\`
            return {
              value: symbol,
              label: \`\${name} (\${symbol})\`,
              data: { symbol, name, type }
            }`;

if (content.includes(target)) {
  content = content.replace(target, replace);
  fs.writeFileSync(file, content);
  console.log("Successfully patched StocksTab.tsx");
} else {
  console.log("Could not find target string in StocksTab.tsx");
}
