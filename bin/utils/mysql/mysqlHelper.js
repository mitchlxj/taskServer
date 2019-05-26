"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var mysqlHelper = /** @class */ (function () {
    function mysqlHelper(pool) {
        this.mysqlResultObj = { err: "", results: '', qy: "" };
        this.pool = pool;
    }
    mysqlHelper.prototype.execWP = function (strSql, params) {
        var _this = this;
        var source$ = rxjs_1.Observable.create(function (observer) {
            _this.pool.getConnection(function (err, connection) {
                if (err) {
                    _this.mysqlResultObj.err = err;
                    observer.next(_this.mysqlResultObj);
                }
                else {
                    var query_1 = connection.query(strSql, params, function (err, results) {
                        connection.release();
                        _this.mysqlResultObj.err = err;
                        _this.mysqlResultObj.results = results;
                        _this.mysqlResultObj.qy = query_1.sql;
                        observer.next(_this.mysqlResultObj);
                    });
                }
                ;
            });
        });
        return source$;
    };
    mysqlHelper.prototype.execWPTRAN = function (strSql, params) {
        var _this = this;
        var source$ = rxjs_1.Observable.create(function (observer) {
            _this.pool.getConnection(function (err, connection) {
                if (err) {
                    _this.mysqlResultObj.err = err;
                    observer.next(_this.mysqlResultObj);
                }
                else {
                    connection.beginTransaction(function (err) {
                        if (err) {
                            connection.release();
                            _this.mysqlResultObj.err = err;
                            observer.next(_this.mysqlResultObj);
                        }
                        else {
                            var query_2 = connection.query(strSql, params, function (err, results) {
                                if (err) {
                                    connection.rollback(function () {
                                        connection.release();
                                        _this.mysqlResultObj.err = err;
                                        _this.mysqlResultObj.qy = query_2.sql;
                                        observer.next(_this.mysqlResultObj);
                                    });
                                }
                                else {
                                    connection.commit(function (err) {
                                        if (err) {
                                            connection.rollback(function () {
                                                connection.release();
                                                _this.mysqlResultObj.err = err;
                                                _this.mysqlResultObj.qy = query_2.sql;
                                                observer.next(_this.mysqlResultObj);
                                            });
                                        }
                                        else {
                                            connection.release();
                                            _this.mysqlResultObj.err = err;
                                            _this.mysqlResultObj.results = results;
                                            _this.mysqlResultObj.qy = query_2.sql;
                                            observer.next(_this.mysqlResultObj);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                ;
            });
        });
        return source$;
    };
    ;
    return mysqlHelper;
}());
exports.default = mysqlHelper;
//# sourceMappingURL=mysqlHelper.js.map