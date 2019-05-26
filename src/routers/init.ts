import  express from 'express';
const router = express.Router();
import * as init from '../controllers/init'
/* GET home page. */

router.post('/getKeyforAccess',init.getKeyforAccess);






export default router;