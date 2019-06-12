import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import JSONRet from "./JSONRet";
import errCode from "./errCode";
import config from './config';
import models from '../models';
import { User, mysqlResultObj } from '../interface';


export function jwtVerify(req: any, res: Response, next: any) {
    let userToken = "";

    if (req.headers.authorization) {
        userToken = req.headers.authorization;

        jwt.verify(userToken, config.jwtTokenSecret, (err, user) => {
            if(err) {
                return res.json(new JSONRet(errCode.permission.DIY("@用户过期，请重新登录!")));
            }else{
                let data:any = {};
                let _user = user as User;
                data.id = _user.id;
                data.token = userToken;
                models.taskUser.checkUserToken(data).subscribe((value:mysqlResultObj) => {
                    if(value.err){
                        return res.json(new JSONRet(errCode.mysql));
                    }else{
                        if(value.results.length>0){
                            req.user = user;
                            next();
                        }else {
                            return res.json(new JSONRet(errCode.permission.DIY("@账号再其他地方登录，请重新登录!")));
                        }
                    }
                })
            }
        })

    } else {
        return res.json(new JSONRet(errCode.permission.DIY("@用户还未登录!")));
    }
}