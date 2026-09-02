const CryptoJS = require("crypto-js");

const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

/**
 * Encrypt plain text using AES (CryptoJS)
 */
function encryptField(value) {
    if (value === null || value === undefined) return value;
    return CryptoJS.AES.encrypt(String(value), CRYPTO_SECRET).toString();
}

/**
 * Decrypt AES-encrypted text.
 */
function decryptField(encryptedValue) {
    if (encryptedValue === null || encryptedValue === undefined) return encryptedValue;
    const bytes = CryptoJS.AES.decrypt(encryptedValue, CRYPTO_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    encryptField,
    decryptField
}