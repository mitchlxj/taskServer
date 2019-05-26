export default class JSONRet{
    public respCode:any;
    public respMsg:any;
    public data:any;
    constructor(code:any,msg?:any,data?:any){
        if(typeof code == "object"){
            this.respCode = code.code;
            this.respMsg = code.msg;
            if(msg){
                this.data = msg;
            }
        }else{
            this.respCode = code;
            this.respMsg = msg;
            if(data){
                this.data = data;
            }
        }
    }
}