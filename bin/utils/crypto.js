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
//# sourceMappingURL=crypto.js.map