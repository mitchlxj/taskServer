import JSONRet from "./JSONRet";
import errCode from "./errCode";
import { Observable, Observer } from "rxjs";
import { encrypt_aes128ecb } from './crypto';
import querystring from 'querystring';
import { requestGet } from './myTool';
import { switchMap, map } from "rxjs/operators";


export function httpBFMRequest(phone: string): Observable<any> {
    const urlHost = "http://passport.epaynfc.com/api/login/ajax?";
    const key = "7F3CBCAB828E054D"
    const data = { "loginType": "phone", "appid": "uympeqzxntglzuh", "reqType": "1" };
    const telephone = phone;
    const ob$ = Observable.create((observer: Observer<any>) => {
        if (telephone == "" || !(/^1[3|4|5|8|2|3|6|7|9|0][0-9]\d{4,8}$/.test(telephone))) {
            return observer.error("手机号不正确！");
        }
        let phone = encrypt_aes128ecb(telephone, key)
        if (!phone) {
            return observer.error("参数不正确");
        }
        let newData = { ...data, phone: phone };

        let url = urlHost + "" + querystring.stringify(newData);
        return observer.next(url);

    });

    return ob$.pipe(
        map(url => url as string),
        switchMap((url: string) => {
            const headers = { "content-type": "application/json" };
            return requestGet(url, headers);
        }))


};