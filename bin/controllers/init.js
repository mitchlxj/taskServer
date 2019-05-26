"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errCode_1 = __importDefault(require("../utils/errCode"));
var JSONRet_1 = __importDefault(require("../utils/JSONRet"));
function getKeyforAccess(req, res) {
    var secriykey = req.sessionID;
    if (req.session) {
        req.session.client_secretkey = secriykey;
        console.log(req.session.client_secretkey);
    }
    var key = secriykey;
    return res.json(new JSONRet_1.default(errCode_1.default.success.DIY("成功了"), key));
}
exports.getKeyforAccess = getKeyforAccess;
;
//# sourceMappingURL=init.js.map