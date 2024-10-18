 //import db from '../database/models/index.js'
 import db from '../database/models/index.js'
import bcrypt from 'bcryptjs'

export const register=async(req,res)=>{
    try {
        const { password, password2, ...rest } = req.body;
        const hashPass = bcrypt.hashSync(password, 10);
        if (!bcrypt.compareSync(password2, hashPass)) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }
        const newUser = await db.User.create({
            ...rest,
            password: hashPass,
            password2:password2,
        });
        return res.status(201).json({
            message: "Usuario registrado con éxito",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const login=(req,res)=>{
    res.send('login')
}