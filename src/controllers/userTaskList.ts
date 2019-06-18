import { Request, Response } from 'express'
import errCode from "../utils/errCode";
import JSONRet from '../utils/JSONRet';
import models from '../models';
import * as crypto from '../utils/crypto';
import { mergeMap, concatMap, map, switchMap, tap, take, mergeAll, concatAll, catchError } from 'rxjs/operators';
import moment from 'moment';
import JwtSign from '../utils/jwt';
import { mysqlResultObj, User, Task, payData, OrderList } from '../interface';
import { of, from } from 'rxjs';
import * as myTool from '../utils/myTool';
// const fs = require('fs');
import fs from 'fs';
import path from 'path';
import { httpBFMRequest } from '../utils/thirdPost';


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
  let data: any = {};
  dataAll.id ? data.task_id = dataAll.id : "";
  userData.id ? data.user_id = userData.id : "";
  userData.user_name ? data.user_name = userData.user_name : "";


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

  models.taskList.mySqlModel.getWhere(where, order).pipe(
    map(value => value.results.length > 0 ? value.results[0] : {}),
  ).subscribe((task: Task) => {
    if (task.status == '1') {
      models.userTaskList.mySqlModel.createOrUpdate(data).pipe(
        map(() => ({ id: dataAll.id, status: 2 })),
        mergeMap((task) => models.taskList.mySqlModel.createOrUpdate(task))
      ).subscribe(value => {
        if (value.err) {
          return res.json(new JSONRet(errCode.mysql));
        }
        return res.json(new JSONRet(errCode.success));
      })
    } else {
      return res.json(new JSONRet(errCode.Err.DIY("任务已经被领取!")));
    }
  })

}


export function myTaskPay(req: Request, res: Response) {
  let dataAll = req.body; // 传入task对象
  let userData: User = req.body.user || {};

  if (!dataAll.frontUrl || !dataAll.id) {
    return res.json(new JSONRet(errCode.Err.DIY("参数不正确！")));
  }

  if (!userData.user_name) {
    return res.json(new JSONRet(errCode.Err.DIY("用户还没有登录！")));
  }

  let backUrl = 'http://127.0.0.1:3400/taskUser/myTaskPayBack';

  let tmpPayData: payData = {};

  let telephone = userData.user_name;

  let nowTime = moment().format("YYMMDDHHmmss");
  let orderId = Math.random().toString(17).substr(2).substr(0, 16) + nowTime;

  let reserved = { name: 'taskPay', task_id: dataAll.id };

  tmpPayData.CpId = '197';
  tmpPayData.appId = '100356';
  tmpPayData.channelId = '137';
  tmpPayData.orderId = orderId;
  tmpPayData.name = '任务支付';
  tmpPayData.txnTime = moment().format("YYYY-MM-DD HH:mm:ss");
  tmpPayData.orderDesc = '任务支付';
  tmpPayData.reserved = JSON.stringify(reserved);
  tmpPayData.version = '1.0.0';
  tmpPayData.backUrl = backUrl;
  tmpPayData.frontUrl = dataAll.frontUrl;
  tmpPayData.payTimeout = moment().add(5, 'm').format("YYYY-MM-DD HH:mm:ss");
  tmpPayData.secretkey = '7dcdfd826f6a28b3fd9b140e41be76a6';

  const url = "https://testpayment.unionpaygame.com/orders/H5";


  models.taskList.mySqlModel.get(dataAll.id).subscribe((resObj: mysqlResultObj) => {
    if (resObj.results.length <= 0) {
      return res.json(new JSONRet(errCode.Err.DIY('没有找到对应得任务！')));
    }

    let task = resObj.results[0];

    if (task.status !== '2') {
      return res.json(new JSONRet(errCode.Err.DIY('任务已经完成！')));
    }

    tmpPayData.txnAmt = parseInt(task.pay_num);
    const txnItem = { propId: '11946', txnItem: Math.round(tmpPayData.txnAmt / 0.01) };
    tmpPayData.txnItem = JSON.stringify(txnItem);

    let DataOrder = myTool.sortEach(tmpPayData);
    let private_key = fs.readFileSync(path.join(__dirname, "../config/files/c6493fd2f5b91ba4c8d7e324ef803b8c_pc_private_key.pem")).toString();
    tmpPayData.sign = crypto.signSHA1(private_key, DataOrder);


    httpBFMRequest(telephone).subscribe(bfmBody => {
      const token = bfmBody.data.token;
      myTool.requestPost(url, tmpPayData).subscribe(body => {
        if (body.respCode == '00') {
          let orderListData: OrderList = {};
          orderListData.order_id = orderId;
          orderListData.pay_num = tmpPayData.txnAmt as string;
          orderListData.task_id = dataAll.id;
          orderListData.user_id = userData.id;
          orderListData.pay_time = moment().format("YYYY-MM-DD HH:mm:ss");

          models.orderList.mySqlModel.createOrUpdate(orderListData).subscribe((value) => {
            if (value.err) {
              return res.json(new JSONRet(errCode.Err.DIY("支付失败")));
            }

            let sign = body.data.sign;
            let public_key = fs.readFileSync(path.join(__dirname, "../config/files/Game_Cp_public.pem")).toString();
            delete body.data.sign;

            let bodyOrder = myTool.sortEach(body.data);
            let _signVerify = crypto.verifySHA1(public_key, bodyOrder, sign);
            if (_signVerify) {
              const url = `${body.data.url}_${token}`;
              return res.json(new JSONRet(errCode.success, url));
            } else {
              return res.json(new JSONRet(errCode.Err.DIY("签名验证失败")));
            }
          })

        } else {
          return res.json(new JSONRet(errCode.Err.DIY(body.respMsg)));
        }
      }, err => res.json(new JSONRet(errCode.Err.DIY("获取TN号失败"), err))
      )

    }, err => res.json(new JSONRet(errCode.Err, err)));

  })


}



export function myTaskPayBack(req: Request, res: Response) {


  let dataAll = req.body;

  res.send("SUCCESS"); //接收到佰付美回调后返回接收成功数据
  if (dataAll.respCode == '00') {
    let reBackData = dataAll.data;
    console.log(JSON.stringify(reBackData));
    let sign = reBackData.sign;
    let public_key = fs.readFileSync(path.join(__dirname, "../myutil/Game_Cp_public.pem")).toString();
    delete reBackData.sign;
    let bodyOrder = myTool.sortEach(reBackData);
    let _signvuerify = crypto.verifySHA1(public_key, bodyOrder, sign);
    if (_signvuerify) {
      if (reBackData.status == 1) {
        console.log("佰付美支付成功--- ");
        let reserved = JSON.parse(reBackData.reserved);
        let data = {
          order_id: reBackData.OderId,
          status: '1',
        }
        const ob$ = models.orderList.mySqlModel.upDateByPkData(data, 'order_id').pipe(
          switchMap(() => models.taskList.mySqlModel.get(reserved.task_id).pipe(
            map((data: mysqlResultObj) => {
              if (data.results.length > 0) {
                return data.results[0];
              } else {
                return {};
              }
            }),
            switchMap((task: Task) => {
              const data = {
                id: task.id,
                status: 3
              }
              return models.taskList.mySqlModel.upDateByPkData(data, 'id')
            }),
          )),
          catchError(err => err),
        );

        ob$.subscribe(value => console.log('回调数据处理完成！'), err => console.log(err));

      } else {
        console.log("佰付美支付失败--- ");
        let data = {
          order_id: reBackData.OderId,
          status: '2',
        }
        models.orderList.mySqlModel.upDateByPkData(data, 'order_id');
      }
    }
  } else {
    console.log("签名验证失败！");
  }

}







