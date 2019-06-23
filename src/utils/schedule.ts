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
            }
            models.userTaskList.mySqlModel.dealMySqlDIY(sql, params).subscribe(
                value => console.log('任务状态删除成功！'), err => console.log(err));

            let params2 = [];
            let sql2 = '';
            for (let myTask of myTasks) {
                sql2 += `update task_list set use_num = use_num + 1 where id =?;`;
                params2.push(myTask.task_id);
            }
            models.taskList.mySqlModel.dealMySqlDIY(sql2, params2).subscribe(
                value => console.log('任务次数回收成功!'), err => console.log(err));

        }

    })
}