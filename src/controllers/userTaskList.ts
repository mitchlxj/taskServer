import { Request, Response } from 'express'
import errCode from "../utils/errCode";
import JSONRet from '../utils/JSONRet';
import models from '../models';
import * as crypto from '../utils/crypto';
import { mergeMap, concatMap, map, switchMap, tap, take, mergeAll, concatAll } from 'rxjs/operators';
import moment from 'moment';
import JwtSign from '../utils/jwt';
import { mysqlResultObj, User } from '../interface';
import { of, from } from 'rxjs';


export function getUserTaskList(req: Request, res: Response) {
  let dataAll = req.body;

  let userData: User = req.body.user || {};

  let where = {
    params: <any[]>[],
    strSql: <string>""
  };
  if (dataAll.id) {
    where.params.push(dataAll.id);
    where.strSql += (where.strSql === "" ? "" : " and ") + "t.id = ? "
  }
  if (userData.id) {
    where.params.push(userData.id);
    where.strSql += (where.strSql === "" ? "" : " and ") + "u.user_id = ? "
  }
  if (dataAll.task_id) {
    where.params.push(dataAll.task_id);
    where.strSql += (where.strSql === "" ? "" : " and ") + "t.task_id = ? "
  }
  if (dataAll.status) {
    where.params.push(`${dataAll.status}`);
    where.strSql += (where.strSql === "" ? "" : " and ") + "t.status = ? "
  }
  if (where.strSql) {
    where.strSql = " where " + where.strSql;
  }

  let order = "order by id desc";

  let page = {
    params: <any[]>[],
    strSql: <string>""
  };
  if (typeof (dataAll.page) == "object" && Object.keys(dataAll.page).length > 0) {
    if (dataAll.page.start >= 1 && dataAll.page.size > 0) {
      page.strSql = " limit ?,?";
      page.params.push((dataAll.page.start - 1) * dataAll.page.size);
      page.params.push(dataAll.page.size);
    }
  }

  models.userTaskList.getUserTaskList(where, order, page).subscribe(value => {
    if (value.err) {
      return res.json(new JSONRet(errCode.mysql));
    }
    return res.json(new JSONRet(errCode.success, value.results));
  })

};


export function setMyTask(req: Request, res: Response) {
  let dataAll = req.body; // 传入task对象
  let userData: User = req.body.user || {};
  let data:any = {};
  dataAll.user_id ? data.user_id = dataAll.user_id : "";
  dataAll.id ? data.task_id = dataAll.id : "";
  userData.id ? data.user_id = userData.id : "";
  userData.user_name ? data.user_name = userData.user_name : "";



  // models.userTaskList.mySqlModel.createOrUpdate(data).subscribe(value => {
  //   if (value.err) {
  //     return res.json(new JSONRet(errCode.mysql));
  //   }
  //   return res.json(new JSONRet(errCode.success));
  // })

  
  models.userTaskList.mySqlModel.createOrUpdate(data).pipe(
    map(() => ({id:dataAll.id,status:2})),
    mergeMap((task) => models.taskList.mySqlModel.createOrUpdate(task))
  ).subscribe(value => {
    if(value.err){
      return res.json(new JSONRet(errCode.mysql));
    }

    return res.json(new JSONRet(errCode.success));
  })
}









