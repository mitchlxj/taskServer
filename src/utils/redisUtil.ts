import redis from 'redis';


export default class redisUtil {

    public redisDB:any = {
        "development":{
            "outer":{
                host:'125.64.21.68',
                port:6379,
                pass:'GmAe&^%836youGen'
            },
            'inner':{
                host:'125.64.21.72',
                port:6379,
                pass:'Rei*(^8239niNwoYYE'
            }
        },
        "production":{
            "outer":{
                host:'125.64.21.68',
                port:6379,
                pass:'GmAe&^%836youGen'
            },
            'inner':{
                host:'125.64.21.68',
                port:6379,
                pass:'GmAe&^%836youGen'
            }
        }
    };

    public config:any;
    public redisClient:any = {};

    constructor(){
       this.config =  this.redisDB[process.env.NODE_ENV || "development"][process.env.NETWORK_ENV || "inner"];
    }

    public createClient():redis.RedisClient{
        let redisClient = redis.createClient(this.config.port,this.config.host,{});
        redisClient.auth(this.config.pass,()=>{});
        redisClient.on('error',function(error){
            console.log(error);
        });
    
        return redisClient;
    }

    public myCreateClient(name:string):redis.RedisClient{
        if(!this.redisClient[name]){
            this.redisClient[name] = this.createClient();
        }
        return this.redisClient[name];
    }

}
