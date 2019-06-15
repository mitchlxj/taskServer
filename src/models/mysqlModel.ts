import { tmpMysqlModel } from './../interface/classModel';
import mysqlMainDB from "../utils/mysql/mainDB";



export default class mysqlModel {

    name: string = "";
    pk: string = "";
    column: string[] = [];

    constructor(config: tmpMysqlModel) {
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
        if (data[this.pk]) {
            let idObj = this.createPkObj(data[this.pk]);
            delete data[this.pk];
            const params = [this.name, data, idObj];
            const strSql = "update ?? set ? where ? ";
            return mysqlMainDB.execWP(strSql, params);
        } else {
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


    getWhere = (where: any, order: any) => {
        const params = [this.column, this.name, ...where.params];
        const strSql = `select ?? from ?? ${where.strSql} ${order}`;
        return mysqlMainDB.execWP(strSql, params);
    };

    getWhereAndPage = (where: any, order: any, page: any) => {
        const params = [this.column, this.name, ...where.params, ...page.params];
        const strSql = `select ?? from ?? ${where.strSql} ${order} ${page.strSql}`;
        return mysqlMainDB.execWP(strSql, params);
    }


}