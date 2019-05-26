"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var process_1 = __importDefault(require("process"));
var mysqlSever = /** @class */ (function () {
    function mysqlSever() {
    }
    mysqlSever.mysqlDB = {
        "development": {
            "outer": {
                connectionLimit: 20,
                host: '39.106.105.209',
                user: 'polyuser',
                password: 'Winner123456!',
                database: 'polypay',
                multipleStatements: true
            },
            'inner': {
                connectionLimit: 20,
                host: '39.106.105.209',
                user: 'taskuser',
                password: 'Xiaojie_123',
                database: 'taskpublic',
                multipleStatements: true
            }
        },
        "production": {
            "outer": {
                connectionLimit: 20,
                host: '192.168.1.11',
                user: 'root',
                password: 'GaMe&^$837mK9eN',
                database: 'polypay',
                multipleStatements: true
            },
            'inner': {
                connectionLimit: 20,
                host: '192.168.1.11',
                user: 'root',
                password: 'WiNNer$^3kj4',
                database: 'polypay',
                multipleStatements: true
            }
        }
    };
    mysqlSever.config = mysqlSever.mysqlDB[process_1.default.env.NODE_ENV || "development"][process_1.default.env.NETWORK_ENV || "inner"];
    return mysqlSever;
}());
exports.default = mysqlSever;
//# sourceMappingURL=mysqlSever.js.map