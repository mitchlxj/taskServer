"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var crypto_1 = require("./crypto");
var querystring_1 = __importDefault(require("querystring"));
var myTool_1 = require("./myTool");
var operators_1 = require("rxjs/operators");
function httpBFMRequest(phone) {
    var urlHost = "http://passport.epaynfc.com/api/login/ajax?";
    var key = "7F3CBCAB828E054D";
    var data = { "loginType": "phone", "appid": "uympeqzxntglzuh", "reqType": "1" };
    var telephone = phone;
    var ob$ = rxjs_1.Observable.create(function (observer) {
        if (telephone == "" || !(/^1[3|4|5|8|2|3|6|7|9|0][0-9]\d{4,8}$/.test(telephone))) {
            return observer.error("手机号不正确！");
        }
        var phone = crypto_1.encrypt_aes128ecb(telephone, key);
        if (!phone) {
            return observer.error("参数不正确");
        }
        var newData = __assign({}, data, { phone: phone });
        var url = urlHost + "" + querystring_1.default.stringify(newData);
        return observer.next(url);
    });
    return ob$.pipe(operators_1.map(function (url) { return url; }), operators_1.switchMap(function (url) {
        var headers = { "content-type": "application/json" };
        return myTool_1.requestGet(url, headers);
    }));
}
exports.httpBFMRequest = httpBFMRequest;
;
//# sourceMappingURL=thirdPost.js.map