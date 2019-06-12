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
    models_1.default.taskUser.userLogin(data).pipe(operators_1.concatMap(function (value) {
        var data2 = {};
        var user = value.results[0];
        data2.ctime = moment_1.default().format('YYYY-MM-DD HH:mm:ss');
        var userToken = jwt_1.default(user);
        data2.token = userToken;
        data2.id = user.id;
        //req.session ? req.session.userToken = userToken : '';
        return models_1.default.taskUser.mySqlModel.createOrUpdate(data2).pipe(operators_1.map(function (res) {
            return { err: res.err, results: userToken, qy: res.qy };
        }));
    })).subscribe(function (userPostData) {
        if (userPostData.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, userPostData.results));
    });
}
exports.userLogin = userLogin;
function userLoginOut(req, res) {
    req.session ? req.session.userToken = '' : '';
    return res.json(new JSONRet_1.default(errCode_1.default.success.DIY("@注销成功")));
}
exports.userLoginOut = userLoginOut;
function getUserInfo(req, res) {
    var dataAll = req.user;
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
//# sourceMappingURL=taskUser.js.map