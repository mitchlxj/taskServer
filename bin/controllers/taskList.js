"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errCode_1 = __importDefault(require("../utils/errCode"));
var JSONRet_1 = __importDefault(require("../utils/JSONRet"));
var models_1 = __importDefault(require("../models"));
function getTaskList(req, res) {
    var dataAll = req.body;
    dataAll.status ? dataAll.status : dataAll.status = '1';
    var where = {
        params: [],
        strSql: ""
    };
    if (dataAll.id) {
        where.params.push(dataAll.id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? ";
    }
    if (dataAll.user_name) {
        where.params.push("%" + dataAll.user_name + "%");
        where.strSql += (where.strSql === "" ? "" : " and ") + "task_name like ? ";
    }
    if (dataAll.status) {
        where.params.push("" + dataAll.status);
        where.strSql += (where.strSql === "" ? "" : " and ") + "status = ? ";
    }
    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "use_num > 0 ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = " order by id desc";
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
    models_1.default.taskList.mySqlModel.getWhereAndPage(where, order, page).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql, value.err.sqlMessage));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, value.results));
    });
    // models.taskList.gtTaskList(where,page).subscribe(value => {
    //   if (value.err) {
    //     return res.json(new JSONRet(errCode.mysql,value.err.sqlMessage));
    //   }
    //   return res.json(new JSONRet(errCode.success, value.results));
    // })
}
exports.getTaskList = getTaskList;
;
function setTaskList(req, res) {
    var dataAll = req.body;
    models_1.default.taskList.mySqlModel.createOrUpdate(dataAll).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success));
    });
}
exports.setTaskList = setTaskList;
//# sourceMappingURL=taskList.js.map