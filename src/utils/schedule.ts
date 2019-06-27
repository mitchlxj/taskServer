import { MyTask } from './../interface/classModel';
import schedule from 'node-schedule';
import models from '../models';
import moment = require('moment');
import { mysqlResultObj } from '../interface';
import { map, mergeMap, tap } from 'rxjs/operators';


export function setSchedule(time = '30 * * * * *', fuc: () => void): schedule.Job {
    const job = schedule.scheduleJob(time, fuc);
    return job;
}


export function stopSchedule(job: schedule.Job) {
    job.cancel();
}


export function rulerSetSchedule(scheduleRuler: schedule.RecurrenceRule, fuc: () => void): schedule.Job {
    const job = schedule.scheduleJob(scheduleRuler, fuc);
    return job;

}



export function myTaskDealSchedule() {

    let where = {
        params: <any[]>[],
        strSql: <string>""
    };

    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "status = 1 "
    }
    if (true) {
        where.strSql += (where.strSql === "" ? "" : " and ") + "pay_lock = 1 "
    }
    if (true) {
        where.params.push(moment().format('YYYY-MM-DD HH:mm:ss'));
        where.strSql += (where.strSql === "" ? "" : " and ") + "expire_time <= ? "
    }
    if (where.strSql) {
        where.strSql = " where " + where.strSql;
    }

    let order = "order by id desc";

    models.userTaskList.mySqlModel.getWhere(where, order).pipe(
        map((value: mysqlResultObj) => value.results),
    ).subscribe((myTasks: MyTask[]) => {
        let params = [];
        let sql = '';
        if (myTasks.length > 0) {
            for (let myTask of myTasks) {
                sql += `update user_task_list set status = ? where id =?;`;
                params.push('3', myTask.id);
                sql += `update task_list set use_num = use_num + 1 where id =?;`;
                params.push(myTask.task_id);
            }
            models.userTaskList.mySqlModel.dealMySqlDIY(sql, params).subscribe(
                value => console.log('任务状态处理成功！'), err => console.log(err));
        }

    })



    let where2 = {
        params: <any[]>[],
        strSql: <string>""
    };

    if (true) {
        where2.strSql += (where2.strSql === "" ? "" : " and ") + "status = 1 "
    }
    if (true) {
        where2.strSql += (where2.strSql === "" ? "" : " and ") + "pay_lock = 2 "
    }
    if (true) {
        where2.params.push(moment().format('YYYY-MM-DD HH:mm:ss'));
        where2.strSql += (where2.strSql === "" ? "" : " and ") + "date_add(expire_time,interval 5 minute) <= ? "
    }
    if (where2.strSql) {
        where2.strSql = " where " + where2.strSql;
    }

    let order2 = "order by id desc";

    models.userTaskList.mySqlModel.getWhere(where2, order2).pipe(
        map(value => value.results),
        

    ).subscribe((myTasks: MyTask[]) => {
        let params = [];
        let sql = '';
        if (myTasks.length > 0) {
            for (let myTask of myTasks) {
                sql += `update user_task_list set status = ? where id =?;`;
                params.push('3', myTask.id);
                sql += `update task_list set use_num = use_num + 1 where id =?;`;
                params.push(myTask.task_id);
            }
            models.userTaskList.mySqlModel.dealMySqlDIY(sql, params).subscribe(
                value => console.log('支付锁定任务状态处理成功！'), err => console.log(err));
              
        }


    })


}