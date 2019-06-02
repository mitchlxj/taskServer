import mysqlMainDB from '../utils/mysql/mainDB';
import { Observable } from 'rxjs';
import { mysqlResultObj, tmpMysqlModel } from '../interface/classModel';
import mysqlModel from './mysqlModel';


export class taskUser implements tmpMysqlModel{
    name:string = "task_user";
    pk:string = "id";
    column:string[] = ["id","area_limit","user_name","user_password","user_type","status","ctime"];
}


export let mySqlModel = new mysqlModel(new taskUser);


export function getTaskUser(data: any):Observable<mysqlResultObj>{
    let sql = "select * from task_user where id =?";
    let params: any[] = [2];
    return mysqlMainDB.execWP(sql, params);
}




