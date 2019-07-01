"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var redisUtil_1 = __importDefault(require("./redisUtil"));
var errCode_1 = __importDefault(require("./errCode"));
var JSONRet_1 = __importDefault(require("./JSONRet"));
var IpBlock = /** @class */ (function () {
    function IpBlock(option) {
        var _this = this;
        this.ip = '';
        this.whiteList = [
            this.ipToNumber('127.0.0.1'),
        ]; // 白名单 不会被禁用
        this.blockList = []; //IP禁用的黑明白
        this.block = false; // 为true将会启动IP锁定
        this.maxCount = 10; // 禁止访问的最大次数
        this.blockCount = 30; // 禁用IP的最大次数
        this.expireIn = 60; // 检测周期
        this.key = 'ipBlock'; // redis保存状态的key值
        var redis_util = new redisUtil_1.default();
        this.redis = redis_util.myCreateClient('store');
        this.redisSub = redis_util.myCreateClient('sub');
        option ? this.block = option.block : '';
        option ? this.maxCount = option.maxCount : '';
        option ? this.expireIn = option.expireIn : '';
        option ? this.key = option.key : '';
        option ? this.blockCount = option.blockCount : '';
        this.initList('block');
        this.initList('white');
        this.redisSub.subscribe('blockAddKey');
        this.redisSub.subscribe('whiteAddKey');
        this.redisSub.subscribe('blockRemoveKey');
        this.redisSub.subscribe('whiteRemoveKey');
        this.redisSub.on("message", function (pattern, key) {
            if (pattern == 'blockAddKey') {
                var _key = parseInt(key);
                _this.blockList.push(_key);
            }
            if (pattern == 'whiteAddKey') {
                var _key = parseInt(key);
                _this.whiteList.push(_key);
            }
            if (pattern == 'blockRemoveKey') {
                var _key = parseInt(key);
                _this.blockList.splice(_this.blockList.indexOf(_key), 1);
            }
            if (pattern == 'whiteRemoveKey') {
                var _key = parseInt(key);
                _this.whiteList.splice(_this.blockList.indexOf(_key), 1);
            }
        });
    }
    IpBlock.getInstance = function (option) {
        if (!this.instance) {
            this.instance = new IpBlock(option);
        }
        return this.instance;
    };
    IpBlock.prototype.ipToNumber = function (ip) {
        var num = 0;
        if (ip == "") {
            return num;
        }
        var aNum = ip.split(".");
        if (aNum.length != 4) {
            return num;
        }
        num += parseInt(aNum[0]) << 24;
        num += parseInt(aNum[1]) << 16;
        num += parseInt(aNum[2]) << 8;
        num += parseInt(aNum[3]) << 0;
        num = num >>> 0; //这个很关键，不然可能会出现负数的情况
        return num;
    };
    IpBlock.prototype.numberToIp = function (num) {
        var ip = "";
        if (num <= 0) {
            return ip;
        }
        var ip3 = (num << 0) >>> 24;
        var ip2 = (num << 8) >>> 24;
        var ip1 = (num << 16) >>> 24;
        var ip0 = (num << 24) >>> 24;
        ip += ip3 + "." + ip2 + "." + ip1 + "." + ip0;
        return ip;
    };
    IpBlock.prototype.initList = function (type) {
        var _this = this;
        this.redis.hgetall(type + "Key", function (err, reply) {
            if (err) {
                return setTimeout(function () {
                    _this.initList(type + "Key");
                }, 1000);
            }
            if (!reply) {
                return;
            }
            if (typeof reply == 'object') {
                for (var key in reply) {
                    var _key = parseInt(key);
                    if (type == 'block') {
                        _this.blockList.push(_key);
                    }
                    if (type == 'white') {
                        _this.whiteList.push(_key);
                    }
                }
            }
        });
    };
    IpBlock.prototype.ipCheck = function (ip) {
        var me = this;
        return new Promise(function (resolve, reject) {
            if (typeof ip == 'object') {
                ip = ip[0];
            }
            if (ip) {
                var ipArr = ip.split(",");
                if (ipArr && ipArr[0]) {
                    ip = ipArr[0];
                    if (ip.indexOf('::ffff:') > -1) {
                        ip = ip.replace('::ffff:', '');
                    }
                    var ipNum_1 = me.ipToNumber(ip);
                    if (ipNum_1) {
                        if (me.whiteList.indexOf(ipNum_1) > -1) {
                            return resolve();
                        }
                        if (me.block && me.blockList.indexOf(ipNum_1) > -1) {
                            return reject('被限制，禁止访问！');
                        }
                        me.redis.incr(me.key + ":" + ipNum_1, function (err, id) {
                            if (err) {
                                return reject('服务器异常，请稍后再试！');
                            }
                            me.redis.expire(me.key + ":" + ipNum_1, me.expireIn, function (err, reply) {
                                if (err) {
                                    return reject('服务器异常,请稍后再试！');
                                }
                                if (id && id > me.maxCount) {
                                    if (me.block && id > me.blockCount) {
                                        me.addIp('block', ipNum_1)
                                            .then(function () { return reject('被限制，禁止访问！'); })
                                            .catch(function (err) { return reject(err); });
                                    }
                                    else {
                                        return reject('操作过于频繁，请稍后再试！');
                                    }
                                }
                                else {
                                    return resolve();
                                }
                            });
                        });
                    }
                    else {
                        return reject('无效IP！');
                    }
                }
            }
            else {
                return reject('无效IP！');
            }
        });
    };
    IpBlock.prototype.addIp = function (type, ipNum) {
        var _this = this;
        if (typeof ipNum == 'string') {
            ipNum = this.ipToNumber(ipNum);
        }
        return new Promise(function (resolve, reject) {
            _this.redis.hset(type + "Key", ipNum, '1', function (err, reply) {
                if (err) {
                    reject("服务器异常,请稍后再试！");
                }
                _this.redis.publish(type + "AddKey", ipNum);
                resolve();
            });
        });
    };
    IpBlock.prototype.removeIp = function (type, ipNum) {
        var _this = this;
        if (typeof ipNum == 'string') {
            ipNum = this.ipToNumber(ipNum);
        }
        return new Promise(function (resolve, reject) {
            _this.redis.hdel(type + "Key", ipNum, function (err, reply) {
                if (err) {
                    reject("服务器异常,请稍后再试！");
                }
                _this.redis.publish(type + "RemoveKey", ipNum);
                resolve(reply);
            });
        });
    };
    return IpBlock;
}());
exports.IpBlock = IpBlock;
function ipBlockMiddleware(option) {
    var ipBlock = IpBlock.getInstance(option);
    return function (req, res, next) {
        var ip = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.remoteAddress || "";
        ipBlock.ipCheck(ip)
            .then(function () { return next(); })
            .catch(function (err) { return res.json(new JSONRet_1.default(errCode_1.default.Err.DIY(err))); });
    };
}
exports.ipBlockMiddleware = ipBlockMiddleware;
//# sourceMappingURL=ipBlock.js.map