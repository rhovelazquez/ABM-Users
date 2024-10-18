import express from 'express';
const router = express.Router();

import { register,login,logout} from '../controller/userAuthController.js';
import { validacion, result } from '../middlewares/validationLogin.js';
import { arrayValidaciones, validateCreateForm } from '../middlewares/validationRegister.js';


router.post('/register', arrayValidaciones, validateCreateForm, register);
router.post('/login', validacion, result, login);


export default router