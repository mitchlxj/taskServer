import redisUtil from "./redisUtil";
import { RedisClient } from "redis";
import { IpBlockOption } from "../interface";
import { Response, Request } from "express";
import errCode from "./errCode";
import JSONRet from "./JSONRet";

export class IpBlock {

    ip: string = '';
    whiteList: number[] = [
        this.ipToNumber('127.0.0.1'),
    ]; // 白名单 不会被禁用
    blockList: number[] = []; //IP禁用的黑明白
    block: boolean = false; // 为true将会启动IP锁定
    maxCount: number = 10; // 禁止访问的最大次数
    blockCount: number = 30; // 禁用IP的最大次数
    expireIn: number = 60; // 检测周期
    key: string = 'ipBlock'; // redis保存状态的key值
    redis: RedisClient;
    redisSub: RedisClient;


    constructor(option?: IpBlockOption) {
        let redis_util = new redisUtil();
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

        this.redisSub.on("message", (pattern, key) => {
            if (pattern == 'blockAddKey') {
                const _key = parseInt(key);
                this.blockList.push(_key);
            }
            if (pattern == 'whiteAddKey') {
                const _key = parseInt(key);
                this.whiteList.push(_key);
            }
            if (pattern == 'blockRemoveKey') {
                const _key = parseInt(key);
                this.blockList.splice(this.blockList.indexOf(_key), 1);
            }
            if (pattern == 'whiteRemoveKey') {
                const _key = parseInt(key);
                this.whiteList.splice(this.blockList.indexOf(_key), 1);
            }
        })

    }


    ipToNumber(ip: string): number {
        let num = 0;
        if (ip == "") {
            return num;
        }

        let aNum = ip.split(".");
        if (aNum.length != 4) {
            return num;
        }
        num += parseInt(aNum[0]) << 24;
        num += parseInt(aNum[1]) << 16;
        num += parseInt(aNum[2]) << 8;
        num += parseInt(aNum[3]) << 0;
        num = num >>> 0;//这个很关键，不然可能会出现负数的情况
        return num;
    }


    numberToIp(num: number): string {
        let ip = "";
        if (num <= 0) {
            return ip;
        }
        const ip3 = (num << 0) >>> 24;
        const ip2 = (num << 8) >>> 24;
        const ip1 = (num << 16) >>> 24;
        const ip0 = (num << 24) >>> 24;

        ip += ip3 + "." + ip2 + "." + ip1 + "." + ip0;

        return ip;
    }


    initList(type: string) {
        this.redis.hgetall(`${type}Key`, (err, reply) => {
            if (err) {
                return setTimeout(() => {
                    this.initList(`${type}Key`);
                }, 1000)
            }

            if (!reply) {
                return
            }
            if (typeof reply == 'object') {
                for (let key in reply) {
                    const _key = parseInt(key);
                    if (type == 'block') {
                        this.blockList.push(_key);
                    }
                    if (type == 'white') {
                        this.whiteList.push(_key);
                    }

                }

            }
        })
    }


    ipCheck(ip: string | string[]): Promise<any> {
        const me = this;
        return new Promise((resolve, reject) => {
            if (typeof ip == 'object') {
                ip = ip[0];
            }
            if (ip) {
                let ipArr = ip.split(",");
                if (ipArr && ipArr[0]) {
                    ip = ipArr[0];

                    if (ip.indexOf('::ffff:') > -1) {
                        ip = ip.replace('::ffff:', '');
                    }

                    let ipNum = me.ipToNumber(ip);

                    if (ipNum) {
                        if (me.whiteList.indexOf(ipNum) > -1) {
                            return resolve();
                        }

                        if (me.block && me.blockList.indexOf(ipNum) > -1) {
                            return reject('被限制，禁止访问！');
                        }
                        me.redis.incr(`${me.key}:${ipNum}`, (err, id) => {
                            if (err) {
                                return reject('服务器异常，请稍后再试！');
                            }
                            me.redis.expire(`${me.key}:${ipNum}`, me.expireIn, (err, reply) => {
                                if (err) {
                                    return reject('服务器异常,请稍后再试！');
                                }
                                if (id && id > me.maxCount) {
                                    if (me.block && id > me.blockCount) {
                                        me.addIp('block', ipNum)
                                            .then(() => reject('被限制，禁止访问！'))
                                            .catch((err) => reject(err));
                                    } else {
                                        return reject('操作过于频繁，请稍后再试！');
                                    }
                                } else {
                                    return resolve();
                                }
                            })
                        })
                    } else {
                        return reject('无效IP！');
                    }
                }
            } else {
                return reject('无效IP！');
            }
        })

    }

    addIp(type: string, ipNum: number | string) {
        if (typeof ipNum == 'string') {
            ipNum = this.ipToNumber(ipNum);
        }
        return new Promise((resolve, reject) => {
            this.redis.hset(`${type}Key`, <string>ipNum, '1', (err, reply) => {
                if (err) {
                    reject("服务器异常,请稍后再试！");
                }
                this.redis.publish(`${type}AddKey`, <string>ipNum);
                resolve();
            })
        })

    }

    removeIp(type: string, ipNum: number | string) {
        if (typeof ipNum == 'string') {
            ipNum = this.ipToNumber(ipNum);
        }
        return new Promise((resolve, reject) => {
            this.redis.hdel(`${type}Key`, <string>ipNum, (err, reply) => {
                if (err) {
                    reject("服务器异常,请稍后再试！");
                }
                this.redis.publish(`${type}RemoveKey`, <string>ipNum);
                resolve(reply);
            })
        })
    }

}


export function ipBlockMiddleware(ipBlock: IpBlock) {

    return (req: Request, res: Response, next: any) => {
        const ip = req.headers['x-forwarded-for'] ||
            req.ip ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.remoteAddress || "";
        ipBlock.ipCheck(ip)
            .then(() => next())
            .catch((err) => res.json(new JSONRet(errCode.Err.DIY(err))));
    }

}