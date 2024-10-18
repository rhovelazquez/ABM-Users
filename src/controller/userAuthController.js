 //import db from '../database/models/index.js'
 import db from '../database/models/index.js'
import bcrypt from 'bcryptjs'
import {createAccessToken} from '../libs/jwt.js'


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
        });

        const token = await createAccessToken({id:newUser.id});
        res.cookie('token',token);

        res.json({
            message: "Usuario registrado con éxito",
            user: {
                id: newUser.id, 
                name: newUser.name,
                email: newUser.email,
            }
        })

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
export const login=async(req,res)=>{
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const userFound = await db.User.findOne({
            where: { email: email }
        });
        
        if (!userFound) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password,userFound.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password"})
        

        const token = await createAccessToken({id:userFound.id});
        res.cookie('token',token);

        res.json({
            user: {
                id: userFound.id, 
                name: userFound.name,
                email: userFound.email,
            }
        })

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const logout=(req, res)=>{
    res.cookie("token","",{
        expires:new Date(0)
    })
    return res.sendStatus(200)
}

export const profile=async(req,res)=>{
    const userFound = await db.User.findByPk(req.user.id);
    if(!userFound) return res.status(400).json({message: 'User not found'})
    return res.json({
        id: userFound.id,
        name: userFound.name,
        email: userFound.email

    })
}