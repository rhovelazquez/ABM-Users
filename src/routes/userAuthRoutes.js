import express from 'express';
const router = express.Router();

import { register,login,logout} from '../controller/userAuthController.js';
import { validacion, result } from '../middlewares/validationLogin.js';

router.post('/register',register);
router.post('/login', validacion, result, login);
router.post('/logout',logout)
export default router