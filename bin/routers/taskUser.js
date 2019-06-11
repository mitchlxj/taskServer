"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var controllers_1 = __importDefault(require("../controllers"));
/* GET home page. */
router.post('/getTaskUser', controllers_1.default.taskUser.getTaskUser);
router.post('/setTaskUser', controllers_1.default.taskUser.setTaskUser);
router.post('/userLogin', controllers_1.default.taskUser.userLogin);
exports.default = router;
//# sourceMappingURL=taskUser.js.map