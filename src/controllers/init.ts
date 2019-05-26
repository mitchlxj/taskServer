import { Request, Response } from 'express'
import errCode from "../utils/errCode";
import JSONRet from '../utils/JSONRet';


export function getKeyforAccess(req: Request, res: Response){
    let secriykey = req.sessionID;
    if(req.session){
        req.session.client_secretkey = secriykey;
        console.log(req.session.client_secretkey);
    }
   
    let key = secriykey;
    return res.json(new JSONRet(errCode.success.DIY("成功了"),key));
  };