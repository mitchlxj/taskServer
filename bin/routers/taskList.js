"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var controllers_1 = __importDefault(require("../controllers"));
/* GET home page. */
router.post('/getTaskList', controllers_1.default.taskList.getTaskList);
router.post('/setTaskList', controllers_1.default.taskList.setTaskList);
exports.default = router;
//# sourceMappingURL=taskList.js.map