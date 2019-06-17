import mysqlMainDB from '../utils/mysql/mainDB';
import { Observable } from 'rxjs';
import { mysqlResultObj, tmpMysqlModel } from '../interface/classModel';
import mysqlModel from './mysqlModel';


export class orderList implements tmpMysqlModel{
    name:string = "order_list";
    pk:string = "id";
    column:string[] = ["id","order_id","task_id","user_id","pay_num","yield_num","pay_time","status","ctime"];
}


export let mySqlModel = new mysqlModel(new orderList);







