"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysqlModel_1 = __importDefault(require("./mysqlModel"));
var taskUser = /** @class */ (function () {
    function taskUser() {
        this.name = "generalize_user";
        this.pk = "id";
        this.column = ['id', 'user_id', 'user_name', 'ctime'];
    }
    return taskUser;
}());
exports.taskUser = taskUser;
exports.mySqlModel = new mysqlModel_1.default(new taskUser);
//# sourceMappingURL=generalizeUser.js.map