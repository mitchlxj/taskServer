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
    models_1.default.taskUser.userLogin(data).subscribe(function (value) {
        if (value.err) {
            return res.json(new JSONRet_1.default(errCode_1.default.mysql));
        }
        return res.json(new JSONRet_1.default(errCode_1.default.success, value.results));
    });
}
exports.userLogin = userLogin;
//# sourceMappingURL=taskUser.js.map