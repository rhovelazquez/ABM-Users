import express from 'express';
const router = express.Router();
import { getUser,getUsers,createUser,updateUser,deleteUser } from '../controller/userController.js';


router.get('/getAll',getUsers);
router.get('/:id',getUser);
router.post('/create',createUser);
router.put('/update/:id',updateUser);
router.delete('/delete/:id',deleteUser);


export default router;

