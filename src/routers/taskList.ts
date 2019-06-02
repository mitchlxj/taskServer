import  express from 'express';
const router = express.Router();
import controller from '../controllers'
/* GET home page. */

router.post('/getTaskList',controller.taskList.getTaskList);
router.post('/setTaskList',controller.taskList.setTaskList);





export default router;