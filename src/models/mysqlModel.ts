import { mysqlModelObj } from './../interface/classModel';
import mysqlMainDB from "../utils/mysql/mainDB";
import errCode from '../utils/errCode';



export default class mysqlModel {

    name: string = "";
    pk: string = "";
    column: string[] = [];

    constructor(config: mysqlModelObj) {
        if (!(typeof config == "object" && config.name && config.pk && config.column)) {
            throw Error("无效的config");
        }
        this.name = config.name;
        this.pk = config.pk;
        this.column = config.column;
    };

    createPkObj(id: string | number) {
        let obj: any = {};
        obj[this.pk] = id;
        return obj;
    }

    createOrUpdate(data: any) {
        if(data[this.pk]){
            let idObj = this.createPkObj(data[this.pk]);
            delete data[this.pk];
            const params = [this.name, data, idObj];
            const strSql = "update ?? set ? where ? ";
            return mysqlMainDB.execWP(strSql, params);
        }else{
            const params = [this.name, data];
            const strSql = "insert into ?? set ?";
            return mysqlMainDB.execWP(strSql, params);
        }
    }


    get(id: any) {
        const params = [this.column, this.name, this.createPkObj(id)];
        const strSql = "select ?? from ?? where ? ";
        return mysqlMainDB.execWP(strSql, params);
    };


    getWhere = (data: any) => {
        const params = [this.column, this.name, ...data.params];
        const strSql = `select ?? from ?? ${data.strSql}`;
        return mysqlMainDB.execWP(strSql, params);
    };


}