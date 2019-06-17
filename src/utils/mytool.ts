import { Observable, Observer } from 'rxjs';
import request from 'request';

export function modelSet$(fuc:(data:object)=>object):Observable<object>{
    let obj = fuc;
    let source$ = Observable.create((observer:Observer<object>)=>{
        observer.next(obj);
    })

    return source$;

}



export function sortEach(data:any){
    let arry = [];
    let str = "";
    for (let it in data) {
        arry.push(it + "=" + data[it])
    }
    let toArry = arry.sort();
    toArry.forEach((rec) => {
        str += rec + "&"
    });
    if (str.length > 0) {
        str = str.substr(0, str.length - 1)
    }
    return str;
}

export function requestPost(url:string,body:any): Observable<any>{

   const post$ = Observable.create((observer: Observer<any>) => {
        request.post({url:url,body:body,json:true},(err,res,body)=>{
            if (!err && res.statusCode === 200) {
                observer.next(body);
            }else{
                observer.error(err);
            }
        })
    })

    return post$;


} 