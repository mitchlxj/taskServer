import * as _ from 'lodash';


class ErrCode{
    public code:any;
    public msg:any;
    public message :any;
    constructor(code:any,msg:any){
        this.code = code;
        this.msg = msg;
        this.message = `${code=='00'?'':'[code]'+msg}`;
        Error.captureStackTrace(this);
    }
}


class ErrDefine{
    public code:any;
    public msg?:string;
    constructor(code:any,msg?:string){
        this.code = code;
        this.msg = msg;
       
    }

    public DIY(m:any):ErrCode{
       
        this.msg = m;

        return new ErrCode(this.code,this.msg);
    }
    

}


const errCode = {
    success : new ErrDefine("00","成功"),
    Err : new ErrDefine("01","失败"),
    mysql : new ErrDefine("02","服务器连接失败"),
    permission : new ErrDefine("97","无访问权限"), 
    
}

export default errCode;
