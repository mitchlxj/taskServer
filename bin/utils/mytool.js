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
function requestPost(url, body, json, headers) {
    if (json === void 0) { json = true; }
    var post$ = rxjs_1.Observable.create(function (observer) {
        request_1.default.post({ url: url, body: body, json: json, headers: headers }, function (err, res, body) {
            if (!err && res.statusCode === 200) {
                observer.next(body);
            }
            else {
                observer.error(err);
            }
        });
    });
    return post$;
}
exports.requestPost = requestPost;
function requestGet(url, headers) {
    var get$ = rxjs_1.Observable.create(function (observer) {
        request_1.default.get({ url: url, json: true, headers: headers }, function (err, res, body) {
            if (!err && res.statusCode === 200) {
                observer.next(body);
            }
            else {
                observer.error(err);
            }
        });
    });
    return get$;
}
exports.requestGet = requestGet;
//# sourceMappingURL=myTool.js.map