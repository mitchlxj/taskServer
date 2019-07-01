"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var controllers_1 = __importDefault(require("../controllers"));
/* GET home page. */
router.post('/getKeyforAccess', controllers_1.default.init.getKeyforAccess);
exports.default = router;
//# sourceMappingURL=init.js.map