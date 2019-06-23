import { Request, Response } from 'express'
import errCode from "../utils/errCode";
import JSONRet from '../utils/JSONRet';
import models from '../models';


export function getTaskList(req: Request, res: Response) {
  let dataAll = req.body;

  dataAll.status ? dataAll.status : dataAll.status = '1';

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
    where.strSql += (where.strSql === "" ? "" : " and ") + "task_name like ? "
  }
  if (dataAll.status) {
    where.params.push(`${dataAll.status}`);
    where.strSql += (where.strSql === "" ? "" : " and ") + "status = ? "
  }
  if(true) {
    where.strSql += (where.strSql === "" ? "" : " and ") + "use_num > 0 "
  }
  if (where.strSql) {
    where.strSql = " where " + where.strSql;
  }

  let order = " order by id desc";

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



  models.taskList.mySqlModel.getWhereAndPage(where, order, page).subscribe(value => {
    if (value.err) {
      return res.json(new JSONRet(errCode.mysql, value.err.sqlMessage));
    }
    return res.json(new JSONRet(errCode.success, value.results));
  })
  // models.taskList.gtTaskList(where,page).subscribe(value => {
  //   if (value.err) {
  //     return res.json(new JSONRet(errCode.mysql,value.err.sqlMessage));
  //   }
  //   return res.json(new JSONRet(errCode.success, value.results));
  // })

};

export function setTaskList(req: Request, res: Response) {
  let dataAll = req.body;
  models.taskList.mySqlModel.createOrUpdate(dataAll).subscribe(value => {
    if (value.err) {
      return res.json(new JSONRet(errCode.mysql));
    }
    return res.json(new JSONRet(errCode.success));
  })
}

