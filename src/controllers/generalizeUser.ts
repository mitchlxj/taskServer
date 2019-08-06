import { Request, Response } from 'express'
import errCode from "../utils/errCode";
import JSONRet from '../utils/JSONRet';
import models from '../models';
import * as crypto from '../utils/crypto';
import { mergeMap, concatMap, map, switchMap, tap, take, mergeAll, concatAll } from 'rxjs/operators';
import moment from 'moment';
import JwtSign from '../utils/jwt';
import { mysqlResultObj } from '../interface';
import { of, from } from 'rxjs';


export function getGeneralizeUser(req: Request, res: Response) {
  let dataAll = req.body;

  let where = {
    params: <any[]>[],
    strSql: <string>""
  };
  if (dataAll.id) {
    where.params.push(dataAll.id);
    where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? "
  }
  if (dataAll.user_name) {
    where.params.push(`%${dataAll.user_name}%`);
    where.strSql += (where.strSql === "" ? "" : " and ") + "user_name like ? "
  }
  if (dataAll.status) {
    where.params.push(`${dataAll.status}`);
    where.strSql += (where.strSql === "" ? "" : " and ") + "status = ? "
  }
  if (where.strSql) {
    where.strSql = " where " + where.strSql;
  }

  let order = "order by id desc";

  models.taskUser.mySqlModel.getWhere(where, order).subscribe(value => {
    if (value.err) {
      return res.json(new JSONRet(errCode.mysql));
    }
    return res.json(new JSONRet(errCode.success, value.results));
  })

};

export function setGeneralizeUser(req: Request, res: Response) {
  let dataAll = req.body;
  models.taskUser.mySqlModel.createOrUpdate(dataAll).subscribe(value => {
    if (value.err) {
      return res.json(new JSONRet(errCode.mysql));
    }
    return res.json(new JSONRet(errCode.success));
  })
}








