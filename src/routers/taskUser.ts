import  express from 'express';
const router = express.Router();
import controller from '../controllers'
/* GET home page. */

router.post('/getTaskUser',controller.taskUser.getTaskUser);
router.post('/setTaskUser',controller.taskUser.setTaskUser);





export default router;