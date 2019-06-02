"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mainDB_1 = __importDefault(require("../utils/mysql/mainDB"));
var mysqlModel = /** @class */ (function () {
    function mysqlModel(config) {
        var _this = this;
        this.name = "";
        this.pk = "";
        this.column = [];
        this.getWhere = function (data, order) {
            var params = [_this.column, _this.name].concat(data.params);
            var strSql = "select ?? from ?? " + data.strSql + " " + order;
            return mainDB_1.default.execWP(strSql, params);
        };
        this.getWhereAndPage = function (data, order, page) {
            var params = [_this.column, _this.name].concat(data.params, page.params);
            var strSql = "select ?? from ?? " + data.strSql + " " + order + " " + page.strSql;
            return mainDB_1.default.execWP(strSql, params);
        };
        if (!(typeof config == "object" && config.name && config.pk && config.column)) {
            throw Error("无效的config");
        }
        this.name = config.name;
        this.pk = config.pk;
        this.column = config.column;
    }
    ;
    mysqlModel.prototype.createPkObj = function (id) {
        var obj = {};
        obj[this.pk] = id;
        return obj;
    };
    mysqlModel.prototype.createOrUpdate = function (data) {
        if (data[this.pk]) {
            var idObj = this.createPkObj(data[this.pk]);
            delete data[this.pk];
            var params = [this.name, data, idObj];
            var strSql = "update ?? set ? where ? ";
            return mainDB_1.default.execWP(strSql, params);
        }
        else {
            var params = [this.name, data];
            var strSql = "insert into ?? set ?";
            return mainDB_1.default.execWP(strSql, params);
        }
    };
    mysqlModel.prototype.get = function (id) {
        var params = [this.column, this.name, this.createPkObj(id)];
        var strSql = "select ?? from ?? where ? ";
        return mainDB_1.default.execWP(strSql, params);
    };
    ;
    return mysqlModel;
}());
exports.default = mysqlModel;
//# sourceMappingURL=mysqlModel.js.map