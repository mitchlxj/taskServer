"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var request_1 = __importDefault(require("request"));
function modelSet$(fuc) {
    var obj = fuc;
    var source$ = rxjs_1.Observable.create(function (observer) {
        observer.next(obj);
    });
    return source$;
}
exports.modelSet$ = modelSet$;
function sortEach(data) {
    var arry = [];
    var str = "";
    for (var it in data) {
        arry.push(it + "=" + data[it]);
    }
    var toArry = arry.sort();
    toArry.forEach(function (rec) {
        str += rec + "&";
    });
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
}
exports.sortEach = sortEach;
function request(tpye, string, body) {
    request_1.default.post({
        url: url,
        body: body,
    });
}
exports.request = request;
//# sourceMappingURL=myTool.js.map