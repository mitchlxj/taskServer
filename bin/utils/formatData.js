"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
function formatPostData(postData) {
    for (var _i = 0, postData_1 = postData; _i < postData_1.length; _i++) {
        var data = postData_1[_i];
        for (var key in data) {
            switch (key) {
                case "ctime":
                case "b_time":
                case "e_time":
                case "s_time":
                case "pay_time":
                    if (data[key]) {
                        data[key] = moment_1.default(data[key]).format("YYYY-MM-DD HH:mm:ss");
                    }
                    break;
            }
        }
    }
    return postData;
}
exports.formatPostData = formatPostData;
//# sourceMappingURL=formatData.js.map