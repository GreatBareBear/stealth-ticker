const line = 'v_sh600519="1~贵州茅台~600519~1589.00~...~";';
const match = line.match(/^v_(.*?)="(.*)";?$/);
console.log(match);
