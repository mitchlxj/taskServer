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
var crypto = __importStar(require("../utils/crypto"));
var operators_1 = require("rxjs/operators");
var moment_1 = __importDefault(require("moment"));
var myTool = __importStar(require("../utils/myTool"));
// const fs = require('fs');
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var thirdPost_1 = require("../utils/thirdPost");
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
    if (!dataAll.frontUrl || !dataAll.id) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("参数不正确！")));
    }
    if (!userData.user_name) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("用户还没有登录！")));
    }
    var backUrl = 'http://127.0.0.1:3400/taskUser/myTaskPayBack';
    var tmpPayData = {};
    var telephone = userData.user_name;
    var nowTime = moment_1.default().format("YYMMDDHHmmss");
    var orderId = Math.random().toString(17).substr(2).substr(0, 16) + nowTime;
    var reserved = { name: 'taskPay', task_id: dataAll.id };
    tmpPayData.CpId = '197';
    tmpPayData.appId = '100356';
    tmpPayData.channelId = '137';
    tmpPayData.orderId = orderId;
    tmpPayData.name = '任务支付';
    tmpPayData.txnTime = moment_1.default().format("YYYY-MM-DD HH:mm:ss");
    tmpPayData.orderDesc = '任务支付';
    tmpPayData.reserved = JSON.stringify(reserved);
    tmpPayData.version = '1.0.0';
    tmpPayData.backUrl = backUrl;
    tmpPayData.frontUrl = dataAll.frontUrl;
    tmpPayData.payTimeout = moment_1.default().add(5, 'm').format("YYYY-MM-DD HH:mm:ss");
    tmpPayData.secretkey = '7dcdfd826f6a28b3fd9b140e41be76a6';
    var url = "https://testpayment.unionpaygame.com/orders/H5";
    models_1.default.taskList.mySqlModel.get(dataAll.id).subscribe(function (resObj) {
        if (resObj.results.length <= 0) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('没有找到对应得任务！')));
        }
        var task = resObj.results[0];
        if (task.status !== '2') {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('任务已经完成！')));
        }
        tmpPayData.txnAmt = parseInt(task.pay_num);
        var txnItem = { propId: '11946', txnItem: Math.round(tmpPayData.txnAmt / 0.01) };
        tmpPayData.txnItem = JSON.stringify(txnItem);
        var DataOrder = myTool.sortEach(tmpPayData);
        var private_key = fs_1.default.readFileSync(path_1.default.join(__dirname, "../config/files/c6493fd2f5b91ba4c8d7e324ef803b8c_pc_private_key.pem")).toString();
        tmpPayData.sign = crypto.signSHA1(private_key, DataOrder);
        thirdPost_1.httpBFMRequest(telephone).subscribe(function (bfmBody) {
            var token = bfmBody.data.token;
            myTool.requestPost(url, tmpPayData).subscribe(function (body) {
                if (body.respCode == '00') {
                    var orderListData = {};
                    orderListData.order_id = orderId;
                    orderListData.pay_num = tmpPayData.txnAmt;
                    orderListData.task_id = dataAll.id;
                    orderListData.user_id = userData.id;
                    orderListData.pay_time = moment_1.default().format("YYYY-MM-DD HH:mm:ss");
                    models_1.default.orderList.mySqlModel.createOrUpdate(orderListData).subscribe(function (value) {
                        if (value.err) {
                            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("支付失败")));
                        }
                        var sign = body.data.sign;
                        var public_key = fs_1.default.readFileSync(path_1.default.join(__dirname, "../config/files/Game_Cp_public.pem")).toString();
                        delete body.data.sign;
                        var bodyOrder = myTool.sortEach(body.data);
                        var _signVerify = crypto.verifySHA1(public_key, bodyOrder, sign);
                        if (_signVerify) {
                            var url_1 = body.data.url + "_" + token;
                            return res.json(new JSONRet_1.default(errCode_1.default.success, url_1));
                        }
                        else {
                            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("签名验证失败")));
                        }
                    });
                }
                else {
                    return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY(body.respMsg)));
                }
            }, function (err) { return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("获取TN号失败"), err)); });
        }, function (err) { return res.json(new JSONRet_1.default(errCode_1.default.Err, err)); });
    });
}
exports.myTaskPay = myTaskPay;
function myTaskPayBack(req, res) {
    var dataAll = req.body;
    res.send("SUCCESS"); //接收到佰付美回调后返回接收成功数据
    if (dataAll.respCode == '00') {
        var reBackData = dataAll.data;
        console.log(JSON.stringify(reBackData));
        var sign = reBackData.sign;
        var public_key = fs_1.default.readFileSync(path_1.default.join(__dirname, "../myutil/Game_Cp_public.pem")).toString();
        delete reBackData.sign;
        var bodyOrder = myTool.sortEach(reBackData);
        var _signvuerify = crypto.verifySHA1(public_key, bodyOrder, sign);
        if (_signvuerify) {
            if (reBackData.status == 1) {
                console.log("佰付美支付成功--- ");
                var reserved_1 = JSON.parse(reBackData.reserved);
                var data = {
                    order_id: reBackData.OderId,
                    status: '1',
                };
                var ob$ = models_1.default.orderList.mySqlModel.upDateByPkData(data, 'order_id').pipe(operators_1.switchMap(function () { return models_1.default.taskList.mySqlModel.get(reserved_1.task_id).pipe(operators_1.map(function (data) {
                    if (data.results.length > 0) {
                        return data.results[0];
                    }
                    else {
                        return {};
                    }
                }), operators_1.switchMap(function (task) {
                    var data = {
                        id: task.id,
                        status: 3
                    };
                    return models_1.default.taskList.mySqlModel.upDateByPkData(data, 'id');
                })); }), operators_1.catchError(function (err) { return err; }));
                ob$.subscribe(function (value) { return console.log('回调数据处理完成！'); }, function (err) { return console.log(err); });
            }
            else {
                console.log("佰付美支付失败--- ");
                var data = {
                    order_id: reBackData.OderId,
                    status: '2',
                };
                models_1.default.orderList.mySqlModel.upDateByPkData(data, 'order_id');
            }
        }
    }
    else {
        console.log("签名验证失败！");
    }
}
exports.myTaskPayBack = myTaskPayBack;
//# sourceMappingURL=userTaskList.js.map