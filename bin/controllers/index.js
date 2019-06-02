"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var taskUser = __importStar(require("./taskUser"));
var taskList = __importStar(require("./taskList"));
var controllers = {
    taskUser: taskUser,
    taskList: taskList,
};
exports.default = controllers;
//# sourceMappingURL=index.js.map