"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errCode_1 = __importDefault(require("../utils/errCode"));
var JSONRet_1 = __importDefault(require("../utils/JSONRet"));
var models_1 = __importDefault(require("../models"));
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
    models_1.default.taskUser.mySqlModel.getWhere(where).subscribe(function (value) {
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
//# sourceMappingURL=taskUser.js.map