"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrCode = /** @class */ (function () {
    function ErrCode(code, msg) {
        this.code = code;
        this.msg = msg;
        this.message = "" + (code == '00' ? '' : '[code]' + msg);
        Error.captureStackTrace(this);
    }
    return ErrCode;
}());
var ErrDefine = /** @class */ (function () {
    function ErrDefine(code, msg) {
        this.code = code;
        this.msg = msg;
    }
    ErrDefine.prototype.DIY = function (m) {
        this.msg = m;
        return new ErrCode(this.code, this.msg);
    };
    return ErrDefine;
}());
var errCode = {
    success: new ErrDefine("00", "成功"),
    Err: new ErrDefine("01", "失败"),
    mysql: new ErrDefine("02", "数据库报错"),
    permission: new ErrDefine("97", "无访问权限"),
};
exports.default = errCode;
//# sourceMappingURL=errCode.js.map