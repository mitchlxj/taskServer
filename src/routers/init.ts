import  express from 'express';
const router = express.Router();
import controller from '../controllers'
/* GET home page. */

router.post('/getKeyforAccess',controller.init.getKeyforAccess);






export default router;