import * as fs from 'fs';

const file = '/workspace/client/src/main/alertService.ts';
let content = fs.readFileSync(file, 'utf8');

const parseCode = content.match(/private parseResponse\([\s\S]*?return newData\n  }/)[0];
const fnStr = "function " + parseCode.replace('private parseResponse', 'parseResponse');

const fullCode = `
${fnStr}

const text = 'v_sz000333="51~美的集团~000333~79.38~79.50~79.50~92349~47850~44499~79.32~9~79.31~7~79.30~62~79.29~44~79.28~31~79.37~21~79.40~5~79.41~1~79.43~1~79.44~2~~20260422120542~-0.12~-0.15~79.63~78.87~79.38/92349/731502923~92349~73150~0.13~13.74~~79.63~78.87~0.96~5440.83~6037.12~2.70~87.45~71.55~0.68~123~79.21~13.74~13.74~~~0.28~73150.2923~0.0000~0~ ~GP-A~1.57~2.44~5.05~19.69~7.31~83.17~67.83~3.45~6.94~2.27~6854151524~7605346973~67.21~8.72~6854151524~~~17.16~-0.18~~CNY~0~~79.23~349~";';
console.log(parseResponse(text));
`;

fs.writeFileSync('test_parse_run.js', require('typescript').transpile(fullCode));
require('child_process').execSync('node test_parse_run.js', {stdio: 'inherit'});
