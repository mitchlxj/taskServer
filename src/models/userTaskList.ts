import mysqlMainDB from '../utils/mysql/mainDB';
import { Observable } from 'rxjs';
import { mysqlResultObj, tmpMysqlModel } from '../interface/classModel';
import mysqlModel from './mysqlModel';


export class UserTaskList implements tmpMysqlModel {
    name: string = "user_task_list";
    pk: string = "id";
    column: string[] = ["id", "user_id", "user_name", "task_id", "status", "ctime"];
}


export let mySqlModel = new mysqlModel(new UserTaskList);



export function getUserTaskList(where: any, order: any, page: any): Observable<any> {
    let sql = `select t.id,t.task_name,t.task_id,t.btime,t.etime,t.area_limit,
    t.task_type,t.pay_type,t.user_type,t.loan_type,t.status,t.img,t.ctime from task_list t
     join user_task_list u on t.id = u.task_id ${where.strSql} ${order} ${page.strSql}`;
    let params: any[] = [...where.params, ...page.params];

    return mysqlMainDB.execWP(sql, params);
}





