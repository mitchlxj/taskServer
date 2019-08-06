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


export function getTaskUser(req: Request, res: Response) {
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

export function setTaskUser(req: Request, res: Response) {
  let dataAll = req.body;
  models.taskUser.mySqlModel.createOrUpdate(dataAll).subscribe(value => {
    if (value.err) {
      return res.json(new JSONRet(errCode.mysql));
    }
    return res.json(new JSONRet(errCode.success));
  })
}


export function userLogin(req: Request, res: Response) {
  let dataAll = req.body;
  if (!(dataAll.user_name || dataAll.password)) {
    return res.json(new JSONRet(errCode.Err.DIY("请输入账号或密码！")));
  }
  let data: any = {}
  dataAll.user_name ? data.user_name = dataAll.user_name : "";
  dataAll.password ? data.password = crypto.encrypt(dataAll.password) : "";

  models.taskUser.userLogin(data).pipe(
    switchMap(value => {
      let data2: any = {};
      let user = value.results[0];

      if (user) {
        data2.ctime = moment().format('YYYY-MM-DD HH:mm:ss');
        let userToken = JwtSign(user);
        data2.token = userToken;
        data2.id = user.id;
        req.session ? req.session.userToken = userToken : '';
        return models.taskUser.mySqlModel.createOrUpdate(data2).pipe(
          map((res) => {
            return { err: res.err, results: userToken, qy: res.qy };
          }),
        )
      } else {
        return of(value).pipe(
          map(res => {
            return { err: res.err, results: res.results, qy: res.qy };
          })
        )
      }


    }),
  ).subscribe(userPostData => {
    if (userPostData.err) {
      return res.json(new JSONRet(errCode.mysql));
    }

    if (userPostData.results.length <= 0) {
      return res.json(new JSONRet(errCode.Err.DIY("用户名或密码错误！")));
    }
    return res.json(new JSONRet(errCode.success, userPostData.results));
  })


}


export function userRegister(req: Request, res: Response) {
  let dataAll = req.body;
  let data: any = {};
  const myReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
  if (!dataAll.user_name || !dataAll.passwordsGroup.password || !dataAll.passwordsGroup.password2 || !dataAll.tmpUserName) {
    return res.json(new JSONRet(errCode.Err.DIY("用户参数错误！")));
  }

  if (!myReg.test(dataAll.user_name)) {
    return res.json(new JSONRet(errCode.Err.DIY("手机号不正确！")));
  }

  if (dataAll.passwordsGroup.password !== dataAll.passwordsGroup.password2) {
    return res.json(new JSONRet(errCode.Err.DIY("两次密码不匹配！")));
  }

  data.user_name = dataAll.user_name;
  data.user_password = crypto.encrypt(dataAll.passwordsGroup.password);
  data.status = '1';
  data.user_type = '3';


  models.taskUser.mySqlModel.getKeyValue('user_name', dataAll.user_name).subscribe(users => {
    if (users.results.length > 0) {
      return res.json(new JSONRet(errCode.Err.DIY("您已经注册过用户了！")));
    }

    models.taskUser.mySqlModel.createOrUpdate(data).subscribe(value => {
      if (value.err) {
        return res.json(new JSONRet(errCode.mysql));
      }
      models.taskUser.mySqlModel.getKeyValue('user_name', dataAll.tmpUserName).pipe(
        map(userData => userData.results[0]),
        map(user => ({ user_name: data.user_name, user_id: user.id })),
        mergeMap(_userData => models.generalizeUser.mySqlModel.createOrUpdate(_userData)),
      ).subscribe(value => {
        if (value.err) {
          return res.json(new JSONRet(errCode.mysql));
        }
        return res.json(new JSONRet(errCode.success.DIY("用户注册成功！")));
      })

    })

  }

  )

}



export function userLoginOut(req: Request, res: Response) {
  req.session ? req.session.userToken = null : "";
  return res.json(new JSONRet(errCode.success.DIY("注销成功")));

}


export function getUserInfo(req: any, res: Response) {
  let dataAll = req.body.user;

  let where = {
    params: <any[]>[],
    strSql: <string>""
  };
  if (dataAll.id) {
    where.params.push(dataAll.id);
    where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? "
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

}






