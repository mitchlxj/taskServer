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
function getMyTaskList(req, res) {
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
        where.params.push(dataAll.status);
        where.strSql += (where.strSql === "" ? "" : " and ") + "t.status = ? ";
    }
    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "u.status != 3 ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = "order by u.status asc, id desc";
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
exports.getMyTaskList = getMyTaskList;
;
function setMyTask(req, res) {
    var dataAll = req.body; // 传入task对象
    var userData = req.body.user || {};
    var data = {};
    dataAll.id ? data.task_id = dataAll.id : "";
    userData.id ? data.user_id = userData.id : "";
    userData.user_name ? data.user_name = userData.user_name : "";
    data.expire_time = moment_1.default().add(60, 's').format('YYYY-MM-DD HH:mm:ss');
    var where = {
        params: [],
        strSql: ""
    };
    if (dataAll.id) {
        where.params.push(dataAll.id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? ";
    }
    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "use_num > 0 ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = "order by id desc";
    var insertId = '';
    var sql = "SELECT COUNT(*) finish_num,t.user_paynum from task_list t join order_list o on t.id = o.task_id \n      join task_user u on u.id = o.user_id where o.user_id = ? and o.status = ? and t.id = ?;\n      select count(*) finish_all,t.use_num from task_list t join order_list o on t.id = o.task_id where o.status = ? and o.task_id = ?;";
    var params = [userData.id, '1', dataAll.id, '1', dataAll.id];
    models_1.default.taskList.mySqlModel.dealMySqlDIY(sql, params).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        var task_data = value.results[0][0];
        if (parseInt(task_data.finish_num) >= parseInt(task_data.user_paynum)) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('已经完成可支付的任务次数！')));
        }
        var task_all_data = value.results[1][0];
        if (parseInt(task_all_data.finish_all) >= parseInt(task_all_data.use_num)) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('任务已达到最大可做次数！')));
        }
        models_1.default.taskList.mySqlModel.getWhere(where, order).pipe(operators_1.map(function (value) { return value.results.length > 0 ? value.results[0] : {}; })).subscribe(function (task) {
            if (task.status == '1' && task.use_num > 0) {
                models_1.default.userTaskList.mySqlModel.createOrUpdate(data).pipe(operators_1.map(function (userTask) { return userTask.results.insertId ? insertId = userTask.results.insertId : ""; }), operators_1.map(function () { return ({ id: dataAll.id, use_num: task.use_num }); }), operators_1.mergeMap(function (task) { return models_1.default.taskList.mySqlModel.createOrUpdate(task); })).subscribe(function (value) {
                    if (value.err) {
                        return res.json(new JSONRet_1.default(errCode_1.default.mysql));
                    }
                    models_1.default.userTaskList.mySqlModel.get(insertId).subscribe(function (value) {
                        if (value.err) {
                            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
                        }
                        return res.json(new JSONRet_1.default(errCode_1.default.success, value.results));
                    }, function (err) { return res.json(new JSONRet_1.default(errCode_1.default.mysql)); });
                }, function (err) { return res.json(new JSONRet_1.default(errCode_1.default.mysql)); });
            }
            else {
                return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("任务被关闭或任务次数已经用完!")));
            }
        }, function (err) { return res.json(new JSONRet_1.default(errCode_1.default.mysql)); });
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
    var backUrl = 'http://39.106.105.209:3000/taskUser/myTaskPayBack';
    var tmpPayData = {};
    var telephone = userData.user_name;
    var nowTime = moment_1.default().format("YYMMDDHHmmss");
    var orderId = Math.random().toString(17).substr(2).substr(0, 16) + nowTime;
    var reserved = { name: 'taskPay', id: dataAll.my_task_id, task_id: dataAll.id, user_id: userData.id };
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
    models_1.default.taskList.mySqlModel.get(dataAll.id).subscribe(function (resObj) {
        if (resObj.results.length <= 0) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('没有找到对应得任务！')));
        }
        var task = resObj.results[0];
        if (task.status !== '1') {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('任务已经被关闭！')));
        }
        if (!task.cp_id || !task.app_id) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('没有对应商户ID！')));
        }
        tmpPayData.CpId = task.cp_id;
        tmpPayData.appId = task.app_id;
        var url = "https://payment.unionpaygame.com/orders/H5";
        models_1.default.userTaskList.mySqlModel.get(dataAll.my_task_id).subscribe(function (resObj) {
            if (resObj.results.length <= 0) {
                return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('没有找到对应得任务！')));
            }
            var myTask = resObj.results[0];
            //支付时间过期
            if (moment_1.default().isAfter(myTask.expire_time)) {
                return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY('支付时间已过期')));
            }
            var myTaskData = { id: dataAll.my_task_id, pay_lock: 2 };
            models_1.default.userTaskList.mySqlModel.createOrUpdate(myTaskData).subscribe(function (value) {
                tmpPayData.txnAmt = parseFloat(task.pay_num);
                var txnItem = { propId: task.prop_id, txnItem: Math.round(tmpPayData.txnAmt / 0.01) };
                tmpPayData.txnItem = JSON.stringify(txnItem);
                var DataOrder = myTool.sortEach(tmpPayData);
                myTool.requestGet(task.secrity_key).subscribe(function (private_key) {
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
                                        var url_1 = body.data.url + "?token=" + token;
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
            }, function (err) { return res.json(new JSONRet_1.default(errCode_1.default.mysql)); });
        });
    });
}
exports.myTaskPay = myTaskPay;
function myTaskPayBack(req, res) {
    var dataAll = req.body;
    res.send("SUCCESS"); //接收到佰付美回调后返回接收成功数据
    console.log(JSON.stringify(dataAll));
    if (dataAll.respCode == '00') {
        var reBackData = dataAll.data;
        var sign = reBackData.sign;
        var public_key = fs_1.default.readFileSync(path_1.default.join(__dirname, "../config/files/Game_Cp_public.pem")).toString();
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
                var ob$ = models_1.default.orderList.mySqlModel.upDateByPkData(data, 'order_id').pipe(operators_1.map(function () { return ({ id: reserved_1.id }); }), operators_1.switchMap(function (userTask) {
                    var data = {
                        status: 2
                    };
                    var where = {
                        params: [],
                        strSql: ""
                    };
                    if (userTask.id) {
                        where.params.push(userTask.id);
                        where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? ";
                    }
                    if (where.strSql) {
                        where.strSql = " where " + where.strSql;
                    }
                    return models_1.default.userTaskList.setUserTaskListByWhere(data, where);
                }), operators_1.catchError(function (err) { return err; }));
                ob$.subscribe(function (value) { return console.log('成功回调数据处理完成！'); }, function (err) { return console.log(err); });
            }
            else {
                console.log("佰付美支付失败--- ");
                var data = {
                    order_id: reBackData.OderId,
                    status: '2',
                };
                var op$ = models_1.default.orderList.mySqlModel.upDateByPkData(data, 'order_id');
                op$.subscribe(function (value) { return console.log('失败回调数据处理完成！'); }, function (err) { return console.log(err); });
            }
        }
        else {
            console.log("签名验证失败！");
        }
    }
    else {
        console.log("数据回调返回失败");
    }
}
exports.myTaskPayBack = myTaskPayBack;
//# sourceMappingURL=userTaskList.js.map