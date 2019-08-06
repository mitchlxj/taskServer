
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

router.post('/getGeneralizeUser', controller.generalizeUser.getGeneralizeUser);
router.post('/setGeneralizeUser', controller.generalizeUser.setGeneralizeUser);


export default router;