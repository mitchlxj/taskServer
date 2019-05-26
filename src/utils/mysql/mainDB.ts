import mysql from 'mysql';
import mysqlHelper from './mysqlHelper';
import mysqlSever from './mysqlSever';

export default new mysqlHelper(mysql.createPool(mysqlSever.config));