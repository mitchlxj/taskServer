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


export function getMyTaskList(req: Request, res: Response) {
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
    where.params.push(dataAll.status);
    where.strSql += (where.strSql === "" ? "" : " and ") + "t.status = ? "
  }
  if (true) {
    where.strSql += (where.strSql === "" ? "" : " and ") + "u.status != 3 "
  }
  if (where.strSql) {
    where.strSql = " where " + where.strSql;
  }

  let order = "order by u.status asc, id desc";

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
  data.expire_time = moment().add(60, 's').format('YYYY-MM-DD HH:mm:ss');

  let where = {
    params: <any[]>[],
    strSql: <string>""
  };
  if (dataAll.id) {
    where.params.push(dataAll.id);
    where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? "
  }
  if (true) {
    where.strSql += (where.strSql === "" ? "" : " and ") + "use_num > 0 "
  }


  if (where.strSql) {
    where.strSql = " where " + where.strSql;
  }

  let order = "order by id desc";

  let insertId = '';


  let sql = `SELECT COUNT(*) finish_num,t.user_paynum from task_list t join order_list o on t.id = o.task_id 
      join task_user u on u.id = o.user_id where o.user_id = ? and o.status = ? and t.id = ?;
      select count(*) finish_all,t.use_num from task_list t join order_list o on t.id = o.task_id where o.status = ? and o.task_id = ?;`;

  let params = [userData.id,'1',dataAll.id,'1',dataAll.id];

  models.taskList.mySqlModel.dealMySqlDIY(sql,params).subscribe(value => {
    if(value.err){
      return res.json(new JSONRet(errCode.mysql));
    }
    const task_data = value.results[0][0];
    if(parseInt(task_data.finish_num) >= parseInt(task_data.user_paynum) ){
      return res.json(new JSONRet(errCode.Err.DIY('已经完成可支付的任务次数！')));
    }
    const task_all_data = value.results[1][0];
    if(parseInt(task_all_data.finish_all) >= parseInt(task_all_data.use_num) ){
      return res.json(new JSONRet(errCode.Err.DIY('任务已达到最大可做次数！')));
    }

    models.taskList.mySqlModel.getWhere(where, order).pipe(
      map(value => value.results.length > 0 ? value.results[0] : {}),
    ).subscribe((task: Task) => {
      if (task.status == '1' && task.use_num > 0) {
        models.userTaskList.mySqlModel.createOrUpdate(data).pipe(
          map((userTask) => userTask.results.insertId ? insertId = userTask.results.insertId : ""),
          map(() => ({ id: dataAll.id, use_num: task.use_num })),
          mergeMap((task) => models.taskList.mySqlModel.createOrUpdate(task))
        ).subscribe(value => {
          if (value.err) {
            return res.json(new JSONRet(errCode.mysql));
          }
  
          models.userTaskList.mySqlModel.get(insertId).subscribe(value => {
            if (value.err) {
              return res.json(new JSONRet(errCode.mysql));
            }
            return res.json(new JSONRet(errCode.success, value.results));
          }, err => res.json(new JSONRet(errCode.mysql)))
        }, err => res.json(new JSONRet(errCode.mysql)))
      } else {
        return res.json(new JSONRet(errCode.Err.DIY("任务被关闭或任务次数已经用完!")));
      }
    }, err => res.json(new JSONRet(errCode.mysql)));

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

  let backUrl = 'http://39.106.105.209:3000/taskUser/myTaskPayBack';

  let tmpPayData: payData = {};

  let telephone = userData.user_name;

  let nowTime = moment().format("YYMMDDHHmmss");
  let orderId = Math.random().toString(17).substr(2).substr(0, 16) + nowTime;

  let reserved = { name: 'taskPay', id: dataAll.my_task_id, task_id: dataAll.id, user_id: userData.id };

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


  models.taskList.mySqlModel.get(dataAll.id).subscribe((resObj: mysqlResultObj) => {
    if (resObj.results.length <= 0) {
      return res.json(new JSONRet(errCode.Err.DIY('没有找到对应得任务！')));
    }

    let task = resObj.results[0];

    if (task.status !== '1') {
      return res.json(new JSONRet(errCode.Err.DIY('任务已经被关闭！')));
    }

    if (!task.cp_id || !task.app_id) {
      return res.json(new JSONRet(errCode.Err.DIY('没有对应商户ID！')));
    }


    tmpPayData.CpId = task.cp_id;
    tmpPayData.appId = task.app_id;

    const url = "https://payment.unionpaygame.com/orders/H5";

    models.userTaskList.mySqlModel.get(dataAll.my_task_id).subscribe((resObj) => {

      if (resObj.results.length <= 0) {
        return res.json(new JSONRet(errCode.Err.DIY('没有找到对应得任务！')));
      }
      let myTask = resObj.results[0];

      //支付时间过期
      if (moment().isAfter(myTask.expire_time)) {

        return res.json(new JSONRet(errCode.Err.DIY('支付时间已过期')));
      }

      const myTaskData = { id: dataAll.my_task_id, pay_lock: 2 };

      models.userTaskList.mySqlModel.createOrUpdate(myTaskData).subscribe(value => {

        tmpPayData.txnAmt = parseFloat(task.pay_num);
        const txnItem = { propId: task.prop_id, txnItem: Math.round(tmpPayData.txnAmt / 0.01) };
        tmpPayData.txnItem = JSON.stringify(txnItem);

        let DataOrder = myTool.sortEach(tmpPayData);
        myTool.requestGet(task.secrity_key).subscribe(private_key => {

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
                    const url = `${body.data.url}?token=${token}`;
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


      }, err => res.json(new JSONRet(errCode.mysql)))

    })

  })




}



export function myTaskPayBack(req: Request, res: Response) {


  let dataAll = req.body;

  res.send("SUCCESS"); //接收到佰付美回调后返回接收成功数据
  console.log(JSON.stringify(dataAll));
  if (dataAll.respCode == '00') {
    let reBackData = dataAll.data;
    let sign = reBackData.sign;
    let public_key = fs.readFileSync(path.join(__dirname, "../config/files/Game_Cp_public.pem")).toString();
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
          map(() => ({ id: reserved.id })),
          switchMap((userTask) => {
            const data = {
              status: 2
            }
            let where = {
              params: <any[]>[],
              strSql: <string>""
            };
            if (userTask.id) {
              where.params.push(userTask.id);
              where.strSql += (where.strSql === "" ? "" : " and ") + "id = ? "
            }


            if (where.strSql) {
              where.strSql = " where " + where.strSql;
            }

            return models.userTaskList.setUserTaskListByWhere(data, where)

          }),
          catchError(err => err)
        )


        ob$.subscribe(value => console.log('成功回调数据处理完成！'), err => console.log(err));

      } else {
        console.log("佰付美支付失败--- ");
        let data = {
          order_id: reBackData.OderId,
          status: '2',
        }
        const op$ = models.orderList.mySqlModel.upDateByPkData(data, 'order_id');

        op$.subscribe(value => console.log('失败回调数据处理完成！'), err => console.log(err));

      }
    } else {
      console.log("签名验证失败！");
    }
  } else {
    console.log("数据回调返回失败");
  }

}








