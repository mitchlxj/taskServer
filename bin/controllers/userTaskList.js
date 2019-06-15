"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errCode_1 = __importDefault(require("../utils/errCode"));
var JSONRet_1 = __importDefault(require("../utils/JSONRet"));
var models_1 = __importDefault(require("../models"));
var operators_1 = require("rxjs/operators");
function getUserTaskList(req, res) {
    var dataAll = req.body;
    var userData = req.body.user || {};
    var where = {
        params: [],
        strSql: ""
    };
    if (dataAll.id) {
        where.params.push(dataAll.id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "t.id = ? ";
    }
    if (userData.id) {
        where.params.push(userData.id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "u.user_id = ? ";
    }
    if (dataAll.task_id) {
        where.params.push(dataAll.task_id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "t.task_id = ? ";
    }
    if (dataAll.status) {
        where.params.push("" + dataAll.status);
        where.strSql += (where.strSql === "" ? "" : " and ") + "t.status = ? ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = "order by id desc";
    var page = {
        params: [],
        strSql: ""
    };
    if (typeof (dataAll.page) == "object" && Object.keys(dataAll.page).length > 0) {
        if (dataAll.page.start >= 1 && dataAll.page.size > 0) {
            page.strSql = " limit ?,?";
            page.params.push((dataAll.page.start - 1) * dataAll.page.size);
            page.params.push(dataAll.page.size);
        }
    }
    models_1.default.userTaskList.getUserTaskList(where, order, page).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, value.results));
    });
}
exports.getUserTaskList = getUserTaskList;
;
function setMyTask(req, res) {
    var dataAll = req.body; // 传入task对象
    var userData = req.body.user || {};
    var data = {};
    dataAll.user_id ? data.user_id = dataAll.user_id : "";
    dataAll.id ? data.task_id = dataAll.id : "";
    userData.id ? data.user_id = userData.id : "";
    userData.user_name ? data.user_name = userData.user_name : "";
    // models.userTaskList.mySqlModel.createOrUpdate(data).subscribe(value => {
    //   if (value.err) {
    //     return res.json(new JSONRet(errCode.mysql));
    //   }
    //   return res.json(new JSONRet(errCode.success));
    // })
    models_1.default.userTaskList.mySqlModel.createOrUpdate(data).pipe(operators_1.map(function () { return ({ id: dataAll.id, status: 2 }); }), operators_1.mergeMap(function (task) { return models_1.default.taskList.mySqlModel.createOrUpdate(task); })).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success));
    });
}
exports.setMyTask = setMyTask;
//# sourceMappingURL=userTaskList.js.map