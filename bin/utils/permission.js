"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var JSONRet_1 = __importDefault(require("./JSONRet"));
var errCode_1 = __importDefault(require("./errCode"));
var config_1 = __importDefault(require("./config"));
var models_1 = __importDefault(require("../models"));
function jwtVerify(req, res, next) {
    var userToken = "";
    if (req.headers.authorization) {
        userToken = req.headers.authorization;
        jsonwebtoken_1.default.verify(userToken, config_1.default.jwtTokenSecret, function (err, user) {
            if (err) {
                return res.json(new JSONRet_1.default(errCode_1.default.permission.DIY("用户状态已过期，请重新登录!")));
            }
            else {
                var data = {};
                var _user = user;
                data.id = _user.id;
                data.token = userToken;
                models_1.default.taskUser.checkUserToken(data).subscribe(function (value) {
                    if (value.err) {
                        return res.json(new JSONRet_1.default(errCode_1.default.mysql));
                    }
                    else {
                        if (value.results.length > 0) {
                            req.body.user = user;
                            next();
                        }
                        else {
                            return res.json(new JSONRet_1.default(errCode_1.default.permission.DIY("用户状态已过期，请重新登录!")));
                        }
                    }
                });
            }
        });
    }
    else {
        return res.json(new JSONRet_1.default(errCode_1.default.permission.DIY("用户还未登录!")));
    }
}
exports.jwtVerify = jwtVerify;
//# sourceMappingURL=permission.js.map