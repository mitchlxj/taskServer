import mysqlMainDB from '../utils/mysql/mainDB';
import { Observable } from 'rxjs';
import { mysqlResultObj, tmpMysqlModel } from '../interface/classModel';
import mysqlModel from './mysqlModel';


export class taskUser implements tmpMysqlModel{
    name:string = "generalize_user";
    pk:string = "id";
    column:string[] = ['id','user_id','user_name','ctime'];
}


export let mySqlModel = new mysqlModel(new taskUser);







