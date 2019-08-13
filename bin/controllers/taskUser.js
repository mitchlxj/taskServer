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
var jwt_1 = __importDefault(require("../utils/jwt"));
var rxjs_1 = require("rxjs");
var formatData_1 = require("../utils/formatData");
function getTaskUser(req, res) {
    var dataAll = req.body;
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
        where.strSql += (where.strSql === "" ? "" : " and ") + "user_name like ? ";
    }
    if (dataAll.status) {
        where.params.push("" + dataAll.status);
        where.strSql += (where.strSql === "" ? "" : " and ") + "status = ? ";
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }
    var order = "order by id desc";
    models_1.default.taskUser.mySqlModel.getWhere(where, order).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, value.results));
    });
}
exports.getTaskUser = getTaskUser;
;
function setTaskUser(req, res) {
    var dataAll = req.body;
    models_1.default.taskUser.mySqlModel.createOrUpdate(dataAll).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success));
    });
}
exports.setTaskUser = setTaskUser;
function userLogin(req, res) {
    var dataAll = req.body;
    if (!(dataAll.user_name || dataAll.password)) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("请输入账号或密码！")));
    }
    var data = {};
    dataAll.user_name ? data.user_name = dataAll.user_name : "";
    dataAll.password ? data.password = crypto.encrypt(dataAll.password) : "";
    models_1.default.taskUser.userLogin(data).pipe(operators_1.switchMap(function (value) {
        var data2 = {};
        var user = value.results[0];
        if (user) {
            data2.ctime = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
            var userToken_1 = jwt_1.default(user);
            data2.token = userToken_1;
            data2.id = user.id;
            req.session ? req.session.userToken = userToken_1 : '';
            return models_1.default.taskUser.mySqlModel.createOrUpdate(data2).pipe(operators_1.map(function (res) {
                return { err: res.err, results: userToken_1, qy: res.qy };
            }));
        }
        else {
            return rxjs_1.of(value).pipe(operators_1.map(function (res) {
                return { err: res.err, results: res.results, qy: res.qy };
            }));
        }
    })).subscribe(function (userPostData) {
        if (userPostData.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        if (userPostData.results.length <= 0) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("用户名或密码错误！")));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, userPostData.results));
    });
}
exports.userLogin = userLogin;
function userRegister(req, res) {
    var dataAll = req.body;
    var data = {};
    var myReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!dataAll.user_name || !dataAll.passwordsGroup.password || !dataAll.passwordsGroup.password2 || !dataAll.tmpUserName) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("用户参数错误！")));
    }
    if (!myReg.test(dataAll.user_name)) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("手机号不正确！")));
    }
    if (dataAll.passwordsGroup.password !== dataAll.passwordsGroup.password2) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("两次密码不匹配！")));
    }
    data.user_name = dataAll.user_name;
    data.user_password = crypto.encrypt(dataAll.passwordsGroup.password);
    data.status = '1';
    data.user_type = '3';
    data.area_limit = '1';
    models_1.default.taskUser.mySqlModel.getKeyValue('user_name', dataAll.user_name).subscribe(function (users) {
        if (users.results.length > 0) {
            return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("您已经注册过用户了！")));
        }
        models_1.default.taskUser.mySqlModel.createOrUpdate(data).subscribe(function (value) {
            if (value.err) {
                return res.json(new JSONRet_1.default(errCode_1.default.mysql));
            }
            models_1.default.taskUser.mySqlModel.getKeyValue('user_name', dataAll.tmpUserName).pipe(operators_1.map(function (userData) { return userData.results[0]; }), operators_1.map(function (user) { return ({ user_name: data.user_name, user_id: user.id }); }), operators_1.mergeMap(function (_userData) { return models_1.default.generalizeUser.mySqlModel.createOrUpdate(_userData); })).subscribe(function (value) {
                if (value.err) {
                    return res.json(new JSONRet_1.default(errCode_1.default.mysql));
                }
                return res.json(new JSONRet_1.default(errCode_1.default.success.DIY("用户注册成功！")));
            });
        });
    });
}
exports.userRegister = userRegister;
function userLoginOut(req, res) {
    req.session ? req.session.userToken = null : "";
    return res.json(new JSONRet_1.default(errCode_1.default.success.DIY("注销成功")));
}
exports.userLoginOut = userLoginOut;
function getUserInfo(req, res) {
    var dataAll = req.body.user;
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
    models_1.default.taskUser.mySqlModel.getWhere(where, order).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, value.results));
    });
}
exports.getUserInfo = getUserInfo;
function getPublicUserList(req, res) {
    var dataAll = req.body;
    var userData = req.body.user || {};
    var where = {
        params: [],
        strSql: ""
    };
    if (userData.id) {
        where.params.push(userData.id);
        where.strSql += (where.strSql === "" ? "" : " and ") + "user_id = ? ";
    }
    if (dataAll.status) {
        where.params.push("" + dataAll.status);
        where.strSql += (where.strSql === "" ? "" : " and ") + "status = ? ";
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
    models_1.default.generalizeUser.mySqlModel.getWhereAndPage(where, order, page).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        var result = formatData_1.formatPostData(value.results);
        return res.json(new JSONRet_1.default(errCode_1.default.success, result));
    });
}
exports.getPublicUserList = getPublicUserList;
;
function seachUserPay(req, res) {
    var dataAll = req.body;
    var userData = req.body.user || {};
    if (!dataAll.user_name) {
        return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY("没有参数！")));
    }
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
    var sql = "select u.user_name,o.pay_num,o.pay_time from order_list o join task_user u on o.user_id = u.id where u.user_name = ? and o.status = 1 order by o.id desc";
    var params = [dataAll.user_name];
    models_1.default.taskUser.mySqlModel.dealMySqlDIY(sql, params).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        var result = formatData_1.formatPostData(value.results);
        return res.json(new JSONRet_1.default(errCode_1.default.success, result));
    });
}
exports.seachUserPay = seachUserPay;
//# sourceMappingURL=taskUser.js.map