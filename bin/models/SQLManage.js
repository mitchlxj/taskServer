"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SQLManage = /** @class */ (function () {
    function SQLManage() {
    }
    SQLManage.prototype.setDataSql = function (tableName, id_name, data, callback) {
        var strSql = "";
        var params = [];
        if (data[id_name]) {
            var id_value = data[id_name];
            delete data[id_name];
            strSql = "update ?? set ? where " + id_name + " = ? ";
            params.push(tableName, data, id_value);
            mysqlMainDB.execWP(strSql, params, function (err, results, query) {
                return callback(err, results, query);
            });
        }
        else {
            delete data[id_name];
            var strSql_1 = "insert into ?? set ?";
            params.push(tableName, data);
            mysqlMainDB.execWP(strSql_1, params, function (err, results, query) {
                callback(err, results, query);
            });
        }
    };
    return SQLManage;
}());
//# sourceMappingURL=SQLManage.js.map