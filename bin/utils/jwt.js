"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("./config"));
function JwtSign(user) {
    var userToken = {
        id: user.id,
        user_name: user.user_name,
        area_limit: user.area_limit,
        user_type: user.user_type,
        status: user.status,
        ctime: user.ctime,
    };
    var token = jsonwebtoken_1.default.sign(userToken, config_1.default.jwtTokenSecret, { expiresIn: '365d' });
    return token;
}
exports.default = JwtSign;
//# sourceMappingURL=jwt.js.map