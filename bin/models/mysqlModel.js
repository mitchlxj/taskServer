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
        /**
         * 通过自定义where条件对象来查询数据
         *
         * @param {*} where
         * @param {*} order
         * @memberof mysqlModel
         */
        this.getWhere = function (where, order) {
            if (order === void 0) { order = ''; }
            var params = [_this.column, _this.name].concat(where.params);
            var strSql = "select ?? from ?? " + where.strSql + " " + order;
            return mainDB_1.default.execWP(strSql, params);
        };
        this.getWhereAndPage = function (where, order, page) {
            var params = [_this.column, _this.name].concat(where.params, page.params);
            var strSql = "select ?? from ?? " + where.strSql + " " + order + " " + page.strSql;
            return mainDB_1.default.execWP(strSql, params);
        };
        this.dealMySqlDIY = function (sql, _params) {
            var params = _params.slice();
            var strSql = sql;
            return mainDB_1.default.execWPTRAN(strSql, params);
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
    mysqlModel.prototype.createMyPkObj = function (id, upPk) {
        var obj = {};
        obj[upPk] = id;
        return obj;
    };
    /**
     * 新增或更新数据，根据传入的字段中是否有主键来决定，没有主键则新增，有主键则更新
     *
     * @param {*} data
     * @returns
     * @memberof mysqlModel
     */
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
    /**
     * 根据指定的主键字段来更新对应数据
     *
     * @param {*} data
     * @param {string} upPk 指定的主键字段
     * @returns
     * @memberof mysqlModel
     */
    mysqlModel.prototype.upDateByPkData = function (data, upPk) {
        var idObj = this.createMyPkObj(data[upPk], upPk);
        delete data[upPk];
        var params = [this.name, data, idObj];
        var strSql = "update ?? set ? where ? ";
        return mainDB_1.default.execWP(strSql, params);
    };
    /**
     * 通过主键来查询数据
     *
     * @param {*} id
     * @returns
     * @memberof mysqlModel
     */
    mysqlModel.prototype.get = function (id) {
        var params = [this.column, this.name, this.createPkObj(id)];
        var strSql = "select ?? from ?? where ? ";
        return mainDB_1.default.execWP(strSql, params);
    };
    ;
    /**
     * 通过字段key和对应的value值来查询数据
     *
     * @param {*} key
     * @param {*} value
     * @returns
     * @memberof mysqlModel
     */
    mysqlModel.prototype.getKeyValue = function (key, value) {
        var params = [this.column, this.name, value];
        var strSql = "select ?? from ?? where " + key + " = ? ";
        return mainDB_1.default.execWP(strSql, params);
    };
    ;
    return mysqlModel;
}());
exports.default = mysqlModel;
//# sourceMappingURL=mysqlModel.js.map