"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var controllers_1 = __importDefault(require("../controllers"));
var ipBlock_1 = require("../utils/ipBlock");
var option = {
    block: true,
    maxCount: 10,
    expireIn: 60,
    blockCount: 20,
    key: 'taskBlockIp'
};
var ipBlock = ipBlock_1.ipBlockMiddleware(option);
/* GET home page. */
router.post('/getGeneralizeUser', controllers_1.default.generalizeUser.getGeneralizeUser);
router.post('/setGeneralizeUser', controllers_1.default.generalizeUser.setGeneralizeUser);
exports.default = router;
//# sourceMappingURL=generalizeUser.js.map