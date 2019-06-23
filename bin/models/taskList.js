"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mainDB_1 = __importDefault(require("../utils/mysql/mainDB"));
var mysqlModel_1 = __importDefault(require("./mysqlModel"));
var taskList = /** @class */ (function () {
    function taskList() {
        this.name = "task_list";
        this.pk = "id";
        this.column = ["id", "task_name", "task_id", "btime", "etime", "area_limit",
            "task_type", "pay_type", "pay_num", "user_type", "use_num", "loan_type", "status", "img", "ctime"];
    }
    return taskList;
}());
exports.taskList = taskList;
exports.mySqlModel = new mysqlModel_1.default(new taskList);
function gtTaskList(data) {
    var sql = "select id,task_name,task_id,date_format(btime,'%Y-%m-%d %H:%i:%s') btime,\n    date_format(etime,'%Y-%m-%d %H:%i:%s') etime,area_limit,task_type,pay_type,user_type,loan_type,status,img,\n    date_format(ctime,'%Y-%m-%d %H:%i:%s') ctime from task_list " + data.strSql;
    var params = [];
    return mainDB_1.default.execWP(sql, params);
}
exports.gtTaskList = gtTaskList;
//# sourceMappingURL=taskList.js.map