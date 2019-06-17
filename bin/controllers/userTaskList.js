"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errCode_1 = __importDefault(require("../utils/errCode"));
var JSONRet_1 = __importDefault(require("../utils/JSONRet"));
var models_1 = __importDefault(require("../models"));
var operators_1 = require("rxjs/operators");
var moment_1 = __importDefault(require("moment"));
var myTool = __importStar(require("../utils/myTool"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
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
    dataAll.id ? data.task_id = dataAll.id : "";
    userData.id ? data.user_id = userData.id : "";
    userData.user_name ? data.user_name = userData.user_name : "";
    var where = {
        params: [],
        strSql: ""
    };
    if (dataAll.id) {
        where.params.push(dataAll.id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = "order by id desc";
    models_1.default.taskList.mySqlModel.getWhere(where, order).pipe(operators_1.map(function (value) { return value.results.length > 0 ? value.results[0] : {}; })).subscribe(function (task) {
        if (task.status == '1') {
            models_1.default.userTaskList.mySqlModel.createOrUpdate(data).pipe(operators_1.map(function () { return ({ id: dataAll.id, status: 2 }); }), operators_1.mergeMap(function (task) { return models_1.default.taskList.mySqlModel.createOrUpdate(task); })).subscribe(function (value) {
                if (value.err) {
                    return res.json(new JSONRet_1.default(errCode_1.default.mysql));
                }
                return res.json(new JSONRet_1.default(errCode_1.default.success));
            });
        }
        else {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("任务已经被领取!")));
        }
    });
}
exports.setMyTask = setMyTask;
function myTaskPay(req, res) {
    var dataAll = req.body; // 传入task对象
    var userData = req.body.user || {};
    var backUrl = 'http://127.0.0.1:3400/taskUser/myTaskPayBack';
    var tmpPayData = {};
    var nowTime = moment_1.default().format("YYMMDDHHmmss");
    var orderId = Math.random().toString(17).substr(2).substr(0, 16) + nowTime;
    tmpPayData.CpId = '205';
    tmpPayData.appId = '100376';
    tmpPayData.channelId = '137';
    tmpPayData.orderId = orderId;
    tmpPayData.name = '任务支付';
    tmpPayData.txnTime = moment_1.default().format("YYYY-MM-DD HH:mm:ss");
    tmpPayData.orderDesc = '任务支付';
    tmpPayData.reserved = 'taskPay';
    tmpPayData.version = '1.0.0';
    tmpPayData.txnAmt = 1;
    tmpPayData.txnItem = { propId: '13109', txnItem: Math.round(tmpPayData.txnAmt / 0.01) };
    tmpPayData.backUrl = 'ffff';
    tmpPayData.frontUrl = 'gggg';
    tmpPayData.payTimeout = moment_1.default().add(5, 'm').format("YYYY-MM-DD HH:mm:ss");
    tmpPayData.secretkey = '7dcdfd826f6a28b3fd9b140e41be76a6';
    tmpPayData.sign = 'ggg';
    var DataOrder = myTool.sortEach(tmpPayData);
    var private_key = fs_1.default.readFileSync(path_1.default.join(__dirname, "../config/files/c6493fd2f5b91ba4c8d7e324ef803b8c_pc_private_key.pem")).toString();
}
exports.myTaskPay = myTaskPay;
function myTaskPayBack(req, res) {
}
exports.myTaskPayBack = myTaskPayBack;
//# sourceMappingURL=userTaskList.js.map