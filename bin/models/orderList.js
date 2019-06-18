"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysqlModel_1 = __importDefault(require("./mysqlModel"));
var orderList = /** @class */ (function () {
    function orderList() {
        this.name = "order_list";
        this.pk = "id";
        this.column = ["id", "order_id", "task_id", "user_id", "pay_num", "yield_num", "pay_time", "status", "ctime"];
    }
    return orderList;
}());
exports.orderList = orderList;
exports.mySqlModel = new mysqlModel_1.default(new orderList);
//# sourceMappingURL=orderList.js.map