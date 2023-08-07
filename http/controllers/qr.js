const { join } = require("path");
const fs = require('fs')

const ctrlQR = async (_, res) => {
  const PATH_QR = join(process.cwd(), `bot.qr.png`);
  const fileStream = fs.createReadStream(PATH_QR);

  res.writeHead(200, { "Content-Type": "image/png" });
  fileStream.pipe(res);
};

module.exports = { ctrlQR };
