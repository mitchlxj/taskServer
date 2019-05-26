import { Observable, Observer } from 'rxjs';

export function modelSet$(fuc:(data:object)=>object):Observable<object>{
    let obj = fuc;
    let source$ = Observable.create((observer:Observer<object>)=>{
        observer.next(obj);
    })

    return source$;

}