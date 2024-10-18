
 //import db from '../database/models/index.js'
 import db from '../database/models/index.js'

 import bcrypt from 'bcryptjs'
export const getUsers=async (req,res)=>{
    try {
        console.log(Object.keys(db))
        const users = await db.User.findAll(); // Asegúrate de que db.User esté definido
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
}
export const getUser=async(req,res)=>{
    try {
        const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud
        const user = await db.User.findByPk(id); // Buscar el usuario por ID
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' }); // Si no se encuentra, retornar error 404
        }
        res.json(user); // Retornar el usuario encontrado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
}
export const createUser=async(req,res)=>{
    try {
        const { name, last_name, email, password, password2 } = req.body; // Obtener los datos del usuario desde el cuerpo de la solicitud
        
        // Validar que las contraseñas coincidan
        if (password !== password2) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const newUser = await db.User.create({ name, last_name, email, password }); // Crear un nuevo usuario
        res.status(201).json(newUser); // Retornar el nuevo usuario creado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
}
export const updateUser=async(req,res)=>{
    try {
        const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud
        const { name, last_name, email, password } = req.body; // Obtener los datos del usuario desde el cuerpo de la solicitud

        const user = await db.User.findByPk(id); // Buscar el usuario por ID
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' }); // Si no se encuentra, retornar error 404
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        const valEmail= email==user.email ? email : user.email;
        // Actualizar el usuario
        await user.update({ name, last_name, email, password:hashedPassword });
        res.json(user); // Retornar el usuario actualizado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
}
export const deleteUser=async(req,res)=>{
    try {
        const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud
        const user = await db.User.findByPk(id); // Buscar el usuario por ID
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' }); // Si no se encuentra, retornar error 404
        }
        await user.destroy(); // Eliminar el usuario
        res.status(204).send(); // Retornar un estado 204 sin contenido
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
}
