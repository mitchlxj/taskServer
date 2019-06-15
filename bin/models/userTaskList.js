"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mainDB_1 = __importDefault(require("../utils/mysql/mainDB"));
var mysqlModel_1 = __importDefault(require("./mysqlModel"));
var UserTaskList = /** @class */ (function () {
    function UserTaskList() {
        this.name = "user_task_list";
        this.pk = "id";
        this.column = ["id", "user_id", "user_name", "task_id", "status", "ctime"];
    }
    return UserTaskList;
}());
exports.UserTaskList = UserTaskList;
exports.mySqlModel = new mysqlModel_1.default(new UserTaskList);
function getUserTaskList(where, order, page) {
    var sql = "select t.id,t.task_name,t.task_id,t.btime,t.etime,t.area_limit,\n    t.task_type,t.pay_type,t.user_type,t.loan_type,t.status,t.img,t.ctime from task_list t\n     join user_task_list u on t.id = u.task_id " + where.strSql + " " + order + " " + page.strSql;
    var params = where.params.concat(page.params);
    return mainDB_1.default.execWP(sql, params);
}
exports.getUserTaskList = getUserTaskList;
//# sourceMappingURL=userTaskList.js.map