import  express from 'express';
const router = express.Router();
import * as taskUser from '../controllers/taskUser'
/* GET home page. */

router.post('/getTaskUser',taskUser.getTaskUser);
router.post('/setTaskUser',taskUser.setTaskUser);





export default router;