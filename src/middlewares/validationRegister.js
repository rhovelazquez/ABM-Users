import { body, validationResult } from 'express-validator';
import db from '../database/models/index.js'; 
import { Op } from 'sequelize';

/* Validaciones */
const arrayValidaciones = [
    body('name')
        .notEmpty()
        .withMessage("El campo nombre no debe estar vacío")
        .isLength({ min: 3 })
        .withMessage("El nombre debe tener mínimo 3 caracteres"),
        
    body('last_name')
        .notEmpty()
        .withMessage("El campo apellido no debe estar vacío")
        .isLength({ min: 3 })
        .withMessage("El apellido debe tener mínimo 3 caracteres"),
        
    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("Formato inválido")
        .custom(async (value) => {
            const user = await db.User.findOne({ where: { email: value } });
            if (user) {
                throw new Error("El email ya se encuentra registrado");
            }
            return true;
        }),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 6 })
        .withMessage("Tu contraseña debe tener mínimo 6 caracteres"),
        
    body('password2')
        .custom((value,{req}) => {
            if(value !== req.body.password){
                return false
            }
            return true
        }).withMessage('Las contraseñas no coinciden'),
];

const validateCreateForm = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
    } else {
        res.status(400).json({ // Cambié a respuesta JSON para API
            errors: errors.mapped(),
            old: req.body,
        });
    }
};

export {
    arrayValidaciones,
    validateCreateForm
};
