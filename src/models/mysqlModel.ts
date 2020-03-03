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

    createMyPkObj(id: string | number, upPk: string) {
        let obj: any = {};
        obj[upPk] = id;
        return obj;
    }


    /**
     * 新增或更新数据，根据传入的字段中是否有主键来决定，没有主键则新增，有主键则更新
     *
     * @param {*} data
     * @returns
     * @memberof mysqlModel
     */
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

    /**
     * 根据指定的主键字段来更新对应数据
     *
     * @param {*} data
     * @param {string} upPk 指定的主键字段
     * @returns
     * @memberof mysqlModel
     */
    upDateByPkData(data: any, upPk: string) {
        let idObj = this.createMyPkObj(data[upPk], upPk);
        delete data[upPk];
        const params = [this.name, data, idObj];
        const strSql = "update ?? set ? where ? ";
        return mysqlMainDB.execWP(strSql, params);
    }

    /**
     * 通过主键来查询数据
     *
     * @param {*} id
     * @returns
     * @memberof mysqlModel
     */
    get(id: any) {
        const params = [this.column, this.name, this.createPkObj(id)];
        const strSql = "select ?? from ?? where ? ";
        return mysqlMainDB.execWP(strSql, params);
    };

    /**
     * 通过字段key和对应的value值来查询数据
     *
     * @param {*} key
     * @param {*} value
     * @returns
     * @memberof mysqlModel
     */
    getKeyValue(key: any,value:any) {
        const params = [this.column, this.name, value];
        const strSql = `select ?? from ?? where ${key} = ? `;
        return mysqlMainDB.execWP(strSql, params);
    };

    /**
     * 通过自定义where条件对象来查询数据
     *
     * @param {*} where
     * @param {*} order
     * @memberof mysqlModel
     */
    getWhere = (where: any, order='') => {
        const params = [this.column, this.name, ...where.params];
        const strSql = `select ?? from ?? ${where.strSql} ${order}`;
        return mysqlMainDB.execWP(strSql, params);
    };

    
    getWhereAndPage = (where: any, order: any, page: any) => {
        const params = [this.column, this.name, ...where.params, ...page.params];
        const strSql = `select ?? from ?? ${where.strSql} ${order} ${page.strSql}`;
        return mysqlMainDB.execWP(strSql, params);
    }


    dealMySqlDIY = (sql:string, _params:any[]) => {
        const params = [..._params];
        const strSql = sql;
        return mysqlMainDB.execWPTRAN(strSql, params);
    };


}