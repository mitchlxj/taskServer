import { mysqlResultObj } from '../../interface/classModel';
import { Observable, Observer } from 'rxjs'

export default class mysqlHelper {
    pool: any;
    mysqlResultObj: mysqlResultObj = { err: "", results: '', qy: "" };
    constructor(pool: any) {
        this.pool = pool;
    }

    execWP(strSql: string, params: any[]): Observable<mysqlResultObj> {
        const source$ = Observable.create((observer: Observer<mysqlResultObj>) => {


            this.pool.getConnection((err: any, connection: any) => {
                if (err) {
                    this.mysqlResultObj.err = err;
                    observer.next(this.mysqlResultObj);
                }
                else {
                    let query = connection.query(strSql, params, (err: any, results: any) => {
                        connection.release();
                        this.mysqlResultObj.err = err;
                        this.mysqlResultObj.results = results;
                        this.mysqlResultObj.qy = query.sql;
                        observer.next(this.mysqlResultObj);

                    });
                };
            })

        })
        return source$;
    }

    execWPTRAN(strSql: string, params: []): Observable<mysqlResultObj> {
        const source$ = Observable.create((observer: Observer<mysqlResultObj>) => {
            this.pool.getConnection((err: any, connection: any) => {
                if (err) {
                    this.mysqlResultObj.err = err;
                    observer.next(this.mysqlResultObj);
                }
                else {
                    connection.beginTransaction((err: any) => {
                        if (err) {
                            connection.release();
                            this.mysqlResultObj.err = err;
                            observer.next(this.mysqlResultObj);
                        } else {

                            let query = connection.query(strSql, params, (err: any, results: any) => {
                                if (err) {
                                    connection.rollback(() => {
                                        connection.release();
                                        this.mysqlResultObj.err = err;
                                        this.mysqlResultObj.qy = query.sql;
                                        observer.next(this.mysqlResultObj);
                                    });
                                }
                                else {
                                    connection.commit((err: any) => {
                                        if (err) {
                                            connection.rollback(() => {
                                                connection.release();
                                                this.mysqlResultObj.err = err;
                                                this.mysqlResultObj.qy = query.sql;
                                                observer.next(this.mysqlResultObj);
                                            });
                                        }
                                        else {
                                            connection.release();
                                            this.mysqlResultObj.err = err;
                                            this.mysqlResultObj.results = results;
                                            this.mysqlResultObj.qy = query.sql;
                                            observer.next(this.mysqlResultObj);
                                        }
                                    });
                                }
                            });

                        }

                    });
                };
            })
        })
        return source$;
    };

}