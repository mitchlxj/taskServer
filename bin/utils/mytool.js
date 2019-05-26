"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
function modelSet$(fuc) {
    var obj = fuc;
    var source$ = rxjs_1.Observable.create(function (observer) {
        observer.next(obj);
    });
    return source$;
}
exports.modelSet$ = modelSet$;
//# sourceMappingURL=mytool.js.map