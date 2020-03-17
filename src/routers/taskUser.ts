
import express from 'express';
const router = express.Router();
import controller from '../controllers'
import * as permission from '../utils/permission';
import {ipBlockMiddleware, IpBlock} from '../utils/ipBlock';
import { IpBlockOption } from '../interface';


const option: IpBlockOption = {
    block: true,
    maxCount: 10,
    expireIn: 60,
    blockCount: 20,
    key: 'taskBlockIp'
}

const ipBlock = ipBlockMiddleware(option);


/* GET home page. */

router.post('/getTaskUser', controller.taskUser.getTaskUser);
router.post('/setTaskUser', controller.taskUser.setTaskUser);
router.post('/userLogin', ipBlock, controller.taskUser.userLogin);
router.post('/userLoginOut', controller.taskUser.userLoginOut);
router.post('/getUserInfo', permission.jwtVerify, controller.taskUser.getUserInfo);
router.post('/userRegister', controller.taskUser.userRegister);
router.post('/seachUserPay', controller.taskUser.seachUserPay);

router.post('/getMyTaskList', permission.jwtVerify, controller.userTaskList.getMyTaskList);
router.post('/setMyTask', permission.jwtVerify, controller.userTaskList.setMyTask);
router.post('/myTaskPay', permission.jwtVerify, controller.userTaskList.myTaskPay);
router.post('/myTaskPayBack', controller.userTaskList.myTaskPayBack);
router.post('/getPublicUserList',permission.jwtVerify, controller.taskUser.getPublicUserList);

router.post('/myTaskDefaultPay',ipBlock,controller.userTaskList.myTaskDefaultPay)


export default router;