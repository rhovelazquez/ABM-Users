import express from 'express';
const router = express.Router();

import { register,login,logout,profile} from '../controller/userAuthController.js';
import { validacion, result } from '../middlewares/validationLogin.js';
import { arrayValidaciones, validateCreateForm } from '../middlewares/validationRegister.js';
import {authRequired}from '../middlewares/validateToken.js'

router.post('/register', arrayValidaciones, validateCreateForm, register);
router.post('/login', validacion, result, login);
router.post('/logout',logout);
router.get('/profile',authRequired,profile)

export default router