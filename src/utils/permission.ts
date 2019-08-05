
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import JSONRet from "./JSONRet";
import errCode from "./errCode";
import config from './config';
import models from '../models';
import { User, mysqlResultObj } from '../interface';

//所有请求都禁止
const allWhiteIp: string[] = ['127.0.0.1', 'localhost', '125.64.21.72', '39.106.105.209'];


export function jwtVerify(req: any, res: Response, next: any) {
    let userToken = "";
    req.session.userToken ? userToken = req.session.userToken : req.headers['authorization'] ? userToken = req.headers['authorization'] : '';
    if (userToken) {
        jwt.verify(userToken, config.jwtTokenSecret, (err, user) => {
            if (err) {
                return res.json(new JSONRet(errCode.permission.DIY("用户状态已过期，请重新登录!")));
            } else {
                let data: any = {};
                let _user = user as User;
                data.id = _user.id;
                data.token = userToken;
                models.taskUser.checkUserToken(data).subscribe((value: mysqlResultObj) => {
                    if (value.err) {
                        return res.json(new JSONRet(errCode.mysql));
                    } else {
                        if (value.results.length > 0) {
                            req.body.user = user;
                            next();
                        } else {
                            return res.json(new JSONRet(errCode.permission.DIY("用户状态已过期，请重新登录!")));
                        }
                    }
                })
            }
        })

    } else {
        return res.json(new JSONRet(errCode.permission.DIY("用户还未登录!")));
    }
}


export function IPCheck(req: Request, res: Response, next: any) {
    let find = false;
    for (let ip of allWhiteIp) {
        if (req.hostname === ip) {
            find = true;
            next();
        }
    }

    if (!find) {
        return res.json(new JSONRet(errCode.permission));
    }

}
