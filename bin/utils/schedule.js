"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_schedule_1 = __importDefault(require("node-schedule"));
var models_1 = __importDefault(require("../models"));
var moment = require("moment");
var operators_1 = require("rxjs/operators");
function setSchedule(time, fuc) {
    if (time === void 0) { time = '30 * * * * *'; }
    var job = node_schedule_1.default.scheduleJob(time, fuc);
    return job;
}
exports.setSchedule = setSchedule;
function stopSchedule(job) {
    job.cancel();
}
exports.stopSchedule = stopSchedule;
function rulerSetSchedule(scheduleRuler, fuc) {
    var job = node_schedule_1.default.scheduleJob(scheduleRuler, fuc);
    return job;
}
exports.rulerSetSchedule = rulerSetSchedule;
function myTaskDealSchedule() {
    var where = {
        params: [],
        strSql: ""
    };
    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "status = 1 ";
    }
    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "pay_lock = 1 ";
    }
    if (true) {
        where.params.push(moment().format('YYYY-MM-DD HH:mm:ss'));
        where.strSql += (where.strSql === "" ? "" : " and ") + "expire_time <= ? ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = "order by id desc";
    models_1.default.userTaskList.mySqlModel.getWhere(where, order).pipe(operators_1.map(function (value) { return value.results; })).subscribe(function (myTasks) {
        var params = [];
        var sql = '';
        if (myTasks.length > 0) {
            for (var _i = 0, myTasks_1 = myTasks; _i < myTasks_1.length; _i++) {
                var myTask = myTasks_1[_i];
                sql += "update user_task_list set status = ? where id =?;";
                params.push('3', myTask.id);
                sql += "update task_list set use_num = use_num + 1 where id =?;";
                params.push(myTask.task_id);
            }
            models_1.default.userTaskList.mySqlModel.dealMySqlDIY(sql, params).subscribe(function (value) { return console.log('任务状态处理成功！'); }, function (err) { return console.log(err); });
        }
    });
    var where2 = {
        params: [],
        strSql: ""
    };
    if (true) {
        where2.strSql += (where2.strSql === "" ? "" : " and ") + "status = 1 ";
    }
    if (true) {
        where2.strSql += (where2.strSql === "" ? "" : " and ") + "pay_lock = 2 ";
    }
    if (true) {
        where2.params.push(moment().format('YYYY-MM-DD HH:mm:ss'));
        where2.strSql += (where2.strSql === "" ? "" : " and ") + "date_add(expire_time,interval 5 minute) <= ? ";
    }
    if (where2.strSql) {
        where2.strSql = " where " + where2.strSql;
    }
    var order2 = "order by id desc";
    models_1.default.userTaskList.mySqlModel.getWhere(where2, order2).pipe(operators_1.map(function (value) { return value.results; })).subscribe(function (myTasks) {
        var params = [];
        var sql = '';
        if (myTasks.length > 0) {
            for (var _i = 0, myTasks_2 = myTasks; _i < myTasks_2.length; _i++) {
                var myTask = myTasks_2[_i];
                sql += "update user_task_list set status = ? where id =?;";
                params.push('3', myTask.id);
                sql += "update task_list set use_num = use_num + 1 where id =?;";
                params.push(myTask.task_id);
            }
            models_1.default.userTaskList.mySqlModel.dealMySqlDIY(sql, params).subscribe(function (value) { return console.log('支付锁定任务状态处理成功！'); }, function (err) { return console.log(err); });
        }
    });
}
exports.myTaskDealSchedule = myTaskDealSchedule;
//# sourceMappingURL=schedule.js.map