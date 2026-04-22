import * as fs from 'fs';

const file = '/workspace/client/src/renderer/src/components/settings/StocksTab.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const exchange = parts\[0\]\s*const code = parts\[1\]\s*const name = parts\[2\]\s*const type = parts\[4\]\s*const symbol = \`\$\{exchange\}\$\{code\}\`/;

const replace = `const exchange = parts[0]
            let code = parts[1]
            const name = parts[2]
            const type = parts[4]

            if (exchange === 'us') {
              code = code.split('.')[0].toUpperCase()
            }

            const symbol = \`\${exchange}\${code}\``;

if (regex.test(content)) {
  content = content.replace(regex, replace);
  fs.writeFileSync(file, content);
  console.log("Successfully patched StocksTab.tsx");
} else {
  console.log("Regex didn't match anything");
}
