import mysqlMainDB from '../utils/mysql/mainDB';
import { Observable } from 'rxjs';
import { mysqlResultObj, tmpMysqlModel } from '../interface/classModel';
import mysqlModel from './mysqlModel';


export class UserTaskList implements tmpMysqlModel {
    name: string = "user_task_list";
    pk: string = "id";
    column: string[] = ["id", "user_id", "user_name", "task_id", "status", "ctime", "expire_time", "pay_lock"];
}


export let mySqlModel = new mysqlModel(new UserTaskList);



export function getUserTaskList(where: any, order: any, page: any): Observable<any> {
    let sql = `select t.id,t.task_name,t.task_id,t.btime,t.etime,t.area_limit,t.pay_num,t.use_num,u.pay_lock,u.expire_time,t.pay_limitnum,t.user_paynum,t.task_desc,
    t.task_type,t.pay_type,t.user_type,t.loan_type,t.status,t.img,t.ctime,u.id my_task_id,u.user_name,u.user_id,u.status as uStatus
     from task_list t join user_task_list u on t.id = u.task_id ${where.strSql} ${order} ${page.strSql}`;
    let params: any[] = [...where.params, ...page.params];

    return mysqlMainDB.execWP(sql, params);
}


export function setUserTaskListByWhere(data: any, where: any): Observable<any> {
    let sql = `update user_task_list set ? ${where.strSql}`;
    let params: any[] = [data, ...where.params];
    return mysqlMainDB.execWP(sql, params);
}


export function updateTaskListUseNum(where:any): Observable<any> {
    let sql = `update task_list set use_num = use_num + 1 ${where.strSql}`;
    let params: any[] = [...where.params];
    return mysqlMainDB.execWP(sql, params);
}


export function getUserTaskFinish(): Observable<any> {
    let sql = `select task_id, count(task_id) task_num from user_task_list where status = '2' group by task_id`;
    let params: any[] = [];
    return mysqlMainDB.execWP(sql,params);
}





