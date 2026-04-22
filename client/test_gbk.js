const fs = require('fs');
const https = require('https');
https.get("https://qt.gtimg.cn/q=sz000333", (res) => {
  let d = Buffer.alloc(0);
  res.on("data", c => d = Buffer.concat([d, c]));
  res.on("end", () => {
    const text = d.toString('utf8');
    const match = text.match(/^v_(.*?)="(.*)";?$/m);
    console.log(match ? match[2].split("~").length : "NO MATCH");
    console.log("text:", text.slice(0, 50));
  });
});
