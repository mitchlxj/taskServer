"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var controllers_1 = __importDefault(require("../controllers"));
var permission = __importStar(require("../utils/permission"));
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
router.post('/getTaskUser', controllers_1.default.taskUser.getTaskUser);
router.post('/setTaskUser', controllers_1.default.taskUser.setTaskUser);
router.post('/userLogin', ipBlock, controllers_1.default.taskUser.userLogin);
router.post('/userLoginOut', controllers_1.default.taskUser.userLoginOut);
router.post('/getUserInfo', permission.jwtVerify, controllers_1.default.taskUser.getUserInfo);
router.post('/getMyTaskList', permission.jwtVerify, controllers_1.default.userTaskList.getMyTaskList);
router.post('/setMyTask', permission.jwtVerify, controllers_1.default.userTaskList.setMyTask);
router.post('/myTaskPay', permission.jwtVerify, controllers_1.default.userTaskList.myTaskPay);
router.post('/myTaskPayBack', controllers_1.default.userTaskList.myTaskPayBack);
exports.default = router;
//# sourceMappingURL=taskUser.js.map