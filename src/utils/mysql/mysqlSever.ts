import process from 'process';


export default class mysqlSever {

    static mysqlDB:any = {
        "development":{
            "outer":{
                connectionLimit:20,
                host: '39.106.105.209',
                user: 'polyuser',
                password: 'Winner123456!',
                database: 'polypay',
                multipleStatements: true
            },
            'inner':{
                connectionLimit:20,
                host: '39.106.105.209',
                user: 'taskuser',
                password: 'Xiaojie_123',
                database: 'taskpublic',
                multipleStatements: true
            }
        },
        "production":{
            "outer":{
                connectionLimit:20,
                host: '192.168.1.11',
                user: 'root',
                password: 'GaMe&^$837mK9eN',
                database: 'polypay',
                multipleStatements: true
            },
            'inner':{
                connectionLimit:20,
                host: '192.168.1.11',
                user: 'root',
                password: 'WiNNer$^3kj4',
                database: 'polypay',
                multipleStatements: true
            }
        }
    };

    static config = mysqlSever.mysqlDB[process.env.NODE_ENV || "development"][process.env.NETWORK_ENV || "inner"];

}
