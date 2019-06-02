"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var taskUser_1 = __importDefault(require("./taskUser"));
var taskList_1 = __importDefault(require("./taskList"));
var init_1 = __importDefault(require("./init"));
var routers = {
    init: init_1.default,
    taskUser: taskUser_1.default,
    taskList: taskList_1.default,
};
exports.default = routers;
//# sourceMappingURL=index.js.map