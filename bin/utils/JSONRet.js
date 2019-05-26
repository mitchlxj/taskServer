"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var JSONRet = /** @class */ (function () {
    function JSONRet(code, msg, data) {
        if (typeof code == "object") {
            this.respCode = code.code;
            this.respMsg = code.msg;
            if (msg) {
                this.data = msg;
            }
        }
        else {
            this.respCode = code;
            this.respMsg = msg;
            if (data) {
                this.data = data;
            }
        }
    }
    return JSONRet;
}());
exports.default = JSONRet;
//# sourceMappingURL=JSONRet.js.map