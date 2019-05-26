"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = __importDefault(require("redis"));
var redisUtil = /** @class */ (function () {
    function redisUtil() {
        this.redisDB = {
            "development": {
                "outer": {
                    host: '39.106.105.209',
                    port: 8000,
                    pass: ''
                },
                'inner': {
                    host: '125.64.21.68',
                    port: 6379,
                    pass: 'GmAe&^%836youGen'
                }
            },
            "production": {
                "outer": {
                    host: '125.64.21.68',
                    port: 6379,
                    pass: 'GmAe&^%836youGen'
                },
                'inner': {
                    host: '125.64.21.68',
                    port: 6379,
                    pass: 'GmAe&^%836youGen'
                }
            }
        };
        this.redisClient = {};
        this.config = this.redisDB[process.env.NODE_ENV || "development"][process.env.NETWORK_ENV || "inner"];
    }
    redisUtil.prototype.createClient = function () {
        var redisClient = redis_1.default.createClient(this.config.port, this.config.host, {});
        redisClient.auth(this.config.pass, function () { });
        redisClient.on('error', function (error) {
            console.log(error);
        });
        return redisClient;
    };
    redisUtil.prototype.myCreateClient = function (name) {
        if (!this.redisClient[name]) {
            this.redisClient[name] = this.createClient();
        }
        return this.redisClient[name];
    };
    return redisUtil;
}());
exports.default = redisUtil;
//# sourceMappingURL=redisUtil.js.map