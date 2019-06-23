export class mysqlResultObj {
  err: any
  results: any
  qy: any
}

export interface tmpMysqlModel {
  name: string;
  pk: string;
  column: string[];
}


export interface Task {
  id?: number;
  task_name?: string;
  task_id?: string;
  btime?: string;
  etime?: string;
  area_limit?: string;
  task_type?: string;
  pay_type?: string;
  user_type?: string;
  loan_type?: string;
  status?: string;
  img?: string;
  ctime?: string;
  pay_num?:string;
  use_num:number;

}


export interface payData {
  version?: string;
  appId?: string;
  CpId?: string;
  channelId?: string;
  orderId?: string;
  frontUrl?: string;
  orderDesc?: string;
  name?: string;
  txnAmt?: any;
  txnTime?: string;
  payTimeout?: string;
  backUrl?: string;
  txnItem?:string;
  secretkey?: string;
  reserved?: string;
  sign?: string | boolean;
}


export interface OrderList{
  order_id?:string;
  task_id?:string;
  user_id?:string;
  pay_num?:string;
  yield_num?:string;
  pay_time?:string;
  status?: string;


}


export interface MyTask {
  id?: number;
  user_id?: string;
  user_name?: string;
  task_id?: string;
  status?: string;
  ctime?: string;
  expire_time?: string;
  pay_lock?: string;

}

