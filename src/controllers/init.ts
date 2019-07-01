import { Request, Response } from 'express'
import errCode from "../utils/errCode";
import JSONRet from '../utils/JSONRet';


export function getKeyforAccess(req: Request, res: Response){
    let secriykey = req.session;
   

    let key = JSON.stringify(secriykey);
    return res.json(new JSONRet(errCode.success.DIY("成功了"),key));
  };