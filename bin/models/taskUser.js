"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mainDB_1 = __importDefault(require("../utils/mysql/mainDB"));
var mysqlModel_1 = __importDefault(require("./mysqlModel"));
var taskUser = /** @class */ (function () {
    function taskUser() {
        this.name = "task_user";
        this.pk = "id";
        this.column = ["id", "area_limit", "user_name", "user_password", "user_type", "status", "ctime"];
    }
    return taskUser;
}());
exports.taskUser = taskUser;
exports.mySqlModel = new mysqlModel_1.default(new taskUser);
function getTaskUser(data) {
    var sql = "select * from task_user where id =?";
    var params = [2];
    return mainDB_1.default.execWP(sql, params);
}
exports.getTaskUser = getTaskUser;
function userLogin(data) {
    var sql = "select id,area_limit,user_name,user_type,status,ctime from task_user where user_name = ? and user_password = ?";
    var params = [data.user_name, data.password];
    return mainDB_1.default.execWP(sql, params);
}
exports.userLogin = userLogin;
function checkUserToken(data) {
    var sql = "select 1 from task_user where id = ? and token = ?";
    var params = [data.id, data.token];
    return mainDB_1.default.execWP(sql, params);
}
exports.checkUserToken = checkUserToken;
//# sourceMappingURL=taskUser.js.map