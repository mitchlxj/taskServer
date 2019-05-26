"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var mysqlHelper_1 = __importDefault(require("./mysqlHelper"));
var mysqlSever_1 = __importDefault(require("./mysqlSever"));
exports.default = new mysqlHelper_1.default(mysql_1.default.createPool(mysqlSever_1.default.config));
//# sourceMappingURL=mainDB.js.map