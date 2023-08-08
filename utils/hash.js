const crypto = require("node:crypto");

const secret_key = "secret_key";
const secret_iv = "secret_iv";
const ecnryption_method = "aes-256-cbc";

const key = crypto
  .createHash("sha512")
  .update(secret_key)
  .digest("hex")
  .substring(0, 32);

const encryptionIV = crypto
  .createHash("sha512")
  .update(secret_iv)
  .digest("hex")
  .substring(0, 16);

/**
 *
 * @param {*} data
 * @returns
 */
const encryptData = (data) => {
  const cipher = crypto.createCipheriv(ecnryption_method, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64"); // Encrypts data and converts to hex and base64
};

/**
 *
 * @param {*} encryptedData
 * @returns
 */
const decryptData = (encryptedData) => {
  try {
    const buff = Buffer.from(encryptedData, "base64");
    const decipher = crypto.createDecipheriv(
      ecnryption_method,
      key,
      encryptionIV
    );
    return (
      decipher.update(buff.toString("utf8"), "hex", "utf8") +
      decipher.final("utf8")
    );
  } catch (e) {
    return 'FAIL'
  }
};

module.exports = { encryptData, decryptData };
