"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var JSONRet_1 = __importDefault(require("../utils/JSONRet"));
/* GET home page. */
exports.getKeyforAccess = function (req, res) {
    var secriykey = req.sessionID;
    if (req.session) {
        req.session.client_secretkey = secriykey;
        console.log(req.session.client_secretkey);
    }
    var key = secriykey;
    return res.json(new JSONRet_1.default("00", key, "fff"));
};
router.post('/getKeyforAccess', exports.getKeyforAccess);
exports.default = router;
//# sourceMappingURL=loginkeyget.js.map