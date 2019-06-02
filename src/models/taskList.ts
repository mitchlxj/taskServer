import mysqlMainDB from '../utils/mysql/mainDB';
import { Observable } from 'rxjs';
import { mysqlResultObj, tmpMysqlModel } from '../interface/classModel';
import mysqlModel from './mysqlModel';


export class taskList implements tmpMysqlModel{
    name:string = "task_list";
    pk:string = "id";
    column:string[] = ["id","task_name","task_id","btime","etime","area_limit",
    "task_type","pay_type","user_type","loan_type","status","img","ctime"];
}


export let mySqlModel = new mysqlModel(new taskList);


export function gtTaskList(data: any):Observable<mysqlResultObj>{
    let sql = `select id,task_name,task_id,date_format(btime,'%Y-%m-%d %H:%i:%s') btime,
    date_format(etime,'%Y-%m-%d %H:%i:%s') etime,area_limit,task_type,pay_type,user_type,loan_type,status,img,
    date_format(ctime,'%Y-%m-%d %H:%i:%s') ctime from task_list ${data.strSql}`;
    let params: any[] = [];
    return mysqlMainDB.execWP(sql, params);
}




