import { body, validationResult } from 'express-validator'; // Cambié a import para usar tipo módulo
import db from '../database/models/index.js'; // Ajusta la ruta según sea necesario
import { Op } from 'sequelize';

/* Validaciones */
const validaciones = [
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
        .optional() // Permitir que el email sea opcional
        .isEmail()
        .withMessage("Formato inválido")
        .custom(async (value, { req }) => {
            // Si el campo email tiene un valor, comprueba si ya existe
            if (value) {
                const user = await db.User.findOne({ where: { email: value, id: { [Op.ne]: req.params.id } } });
                if (user) {
                    throw new Error("El email ya se encuentra registrado");
                }
            }
            return true;
        }),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Tu contraseña debe tener mínimo 6 caracteres"),
];

const validacion = (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors.mapped());
    if (errors.isEmpty()) {
        next();
    } else {
        db.User.findOne({ where: { email: req.body.email } })
            .then(user => {
                res.status(400).json({
                    errors: errors.mapped(),
                    old: req.body,
                    usuario: user
                });
            });
    }
};

export {
    validaciones,
    validacion
};
