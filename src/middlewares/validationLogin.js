import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import db from '../database/models/index.js'; // Ajusta esta importación según la estructura de tu proyecto
import { Op } from 'sequelize';

// Validaciones
export const validacion = [
    body('email')
        .notEmpty()
        .withMessage('Debes escribir un correo electrónico')
        .isEmail()
        .withMessage('Esto no es un correo válido')
        .custom(async (value, { req }) => {
            const user = await db.User.findOne({ where: { email: req.body.email } });
            if (!user) {
                throw new Error('El correo no se encuentra registrado');
            }
            return true;
        }),

        body('password')
        .notEmpty()
        .withMessage('Debes escribir una contraseña')
        .custom(async (value, { req }) => {
            const user = await db.User.findOne({ where: { email: req.body.email } });
            if (user && bcrypt.compareSync(value, user.password)) {
                return true; // La contraseña es correcta
            } else {
                throw new Error('El email o la contraseña son incorrectos');
            }
        }),
];

// Resultado de validación
export const result = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        const user = await db.User.findOne({ where: { email: req.body.email } });
        
        //req.session.userLoged = user;

        // Guarda la sesión en cookies si se seleccionó "recordarme"
        // if (req.body.remember !== undefined) {
        //     res.cookie('SesionUser', req.session.userLoged, {
        //         maxAge: 1000 * 60 * 5, // Cookie por 5 minutos
        //     });
        // }

        next();
    } else {
        // Renderiza o devuelve errores en el backend (sin enviar nada al frontend aún)
        res.status(400).json({
            errors: errors.mapped(),
            old: req.body,
        });
    }
};
