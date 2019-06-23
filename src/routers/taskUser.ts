import  express from 'express';
const router = express.Router();
import controller from '../controllers'
import * as permission from '../utils/permission';
/* GET home page. */

router.post('/getTaskUser',controller.taskUser.getTaskUser);
router.post('/setTaskUser',controller.taskUser.setTaskUser);
router.post('/userLogin',controller.taskUser.userLogin);
router.post('/userLoginOut',controller.taskUser.userLoginOut);
router.post('/getUserInfo',permission.jwtVerify, controller.taskUser.getUserInfo);

router.post('/getMyTaskList',permission.jwtVerify, controller.userTaskList.getMyTaskList);
router.post('/setMyTask',permission.jwtVerify, controller.userTaskList.setMyTask);
router.post('/myTaskPay',permission.jwtVerify, controller.userTaskList.myTaskPay);
router.post('/myTaskPayBack', controller.userTaskList.myTaskPayBack);


export default router;