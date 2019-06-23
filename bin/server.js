"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorhandler_1 = __importDefault(require("errorhandler"));
var schedule_1 = require("./utils/schedule");
var node_schedule_1 = __importDefault(require("node-schedule"));
var app_1 = __importDefault(require("./app"));
app_1.default.use(errorhandler_1.default());
var TaskServer = app_1.default.listen(app_1.default.get("port"), function () {
    console.log("  App is running at http://localhost:%d in %s mode", app_1.default.get("port"), app_1.default.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
var rule = new node_schedule_1.default.RecurrenceRule();
rule.second = [0, 10, 20, 30, 40, 50];
schedule_1.rulerSetSchedule(rule, schedule_1.myTaskDealSchedule);
console.log('开启定时任务');
exports.default = TaskServer;
//# sourceMappingURL=server.js.map