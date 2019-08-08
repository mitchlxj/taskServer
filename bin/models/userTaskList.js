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
        this.column = ["id", "user_id", "user_name", "task_id", "status", "ctime", "expire_time", "pay_lock"];
    }
    return UserTaskList;
}());
exports.UserTaskList = UserTaskList;
exports.mySqlModel = new mysqlModel_1.default(new UserTaskList);
function getUserTaskList(where, order, page) {
    var sql = "select t.id,t.task_name,t.task_id,t.btime,t.etime,t.area_limit,t.pay_num,t.use_num,u.pay_lock,u.expire_time,t.pay_limitnum,t.user_paynum,t.task_desc,\n    t.task_type,t.pay_type,t.user_type,t.loan_type,t.status,t.img,t.ctime,u.id my_task_id,u.user_name,u.user_id,u.status as uStatus\n     from task_list t join user_task_list u on t.id = u.task_id " + where.strSql + " " + order + " " + page.strSql;
    var params = where.params.concat(page.params);
    return mainDB_1.default.execWP(sql, params);
}
exports.getUserTaskList = getUserTaskList;
function setUserTaskListByWhere(data, where) {
    var sql = "update user_task_list set ? " + where.strSql;
    var params = [data].concat(where.params);
    return mainDB_1.default.execWP(sql, params);
}
exports.setUserTaskListByWhere = setUserTaskListByWhere;
function updateTaskListUseNum(where) {
    var sql = "update task_list set use_num = use_num + 1 " + where.strSql;
    var params = where.params.slice();
    return mainDB_1.default.execWP(sql, params);
}
exports.updateTaskListUseNum = updateTaskListUseNum;
function getUserTaskFinish() {
    var sql = "select task_id, count(task_id) task_num from user_task_list where status = '2' group by task_id";
    var params = [];
    return mainDB_1.default.execWP(sql, params);
}
exports.getUserTaskFinish = getUserTaskFinish;
//# sourceMappingURL=userTaskList.js.map