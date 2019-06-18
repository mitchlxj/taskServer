"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var algorithm = 'aes-128-ecb', password = '841787bfaafaadbd94654d3b69d2420f';
function encrypt(text, pwd) {
    if (text)
        text += "";
    try {
        var cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(pwd || password, 'hex'), Buffer.from(''));
        var encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    catch (e) {
        return false;
    }
}
exports.encrypt = encrypt;
function decrypt(text, pwd) {
    try {
        var decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(pwd || password, 'hex'), Buffer.from(''));
        var decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (e) {
        return false;
    }
}
exports.decrypt = decrypt;
function signSHA1(privateKey, data) {
    try {
        var sign = crypto_1.default.createSign('SHA1');
        sign.update(data);
        var _privateKey = privateKey;
        var sig = sign.sign(_privateKey, 'base64');
        return sig;
    }
    catch (err) {
        return false;
    }
}
exports.signSHA1 = signSHA1;
function verifySHA1(publicKey, data, signStr) {
    try {
        var verify = crypto_1.default.createVerify('SHA1');
        verify.update(data, 'utf8');
        var signature = signStr;
        return verify.verify(publicKey, signature, 'base64');
    }
    catch (err) {
        return false;
    }
}
exports.verifySHA1 = verifySHA1;
function encrypt_aes128ecb(data, key) {
    var iv = '';
    var cipherChunks = [];
    var cipher = crypto_1.default.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, 'utf8', 'hex'));
    cipherChunks.push(cipher.final('hex'));
    return cipherChunks.join('');
}
exports.encrypt_aes128ecb = encrypt_aes128ecb;
function decrypt_aes128ecb(data, key) {
    var iv = '';
    var cipherChunks = [];
    var decipher = crypto_1.default.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, 'hex', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));
    return cipherChunks.join('');
}
exports.decrypt_aes128ecb = decrypt_aes128ecb;
//# sourceMappingURL=crypto.js.map