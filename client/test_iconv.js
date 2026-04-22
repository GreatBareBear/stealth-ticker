const iconv = require('iconv-lite');
const https = require('https');
https.get("https://qt.gtimg.cn/q=sz000333", (res) => {
  let d = Buffer.alloc(0);
  res.on("data", c => d = Buffer.concat([d, c]));
  res.on("end", () => {
    const text = iconv.decode(d, 'gbk');
    console.log(text.match(/^v_(.*?)="(.*)";?$/)[2].split("~")[1]);
  });
});
