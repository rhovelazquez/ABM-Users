const { check, body, validationResult } = require("express-validator");
// const users = require('../data/users.json')

/////////BASE DE DATOS///////////
const db= require("../database/models")
const {Op}= require("sequelize");

/* Validaciones */
const validaciones = [
    body('name')
        .notEmpty()
        .withMessage("El campo nombre no debe estar vacio")
        .isLength({ min: 3 }) 
        .withMessage("El Nombre debe tener minimo 3 caracteres"),
    body("phone")
        .isLength({min :6})
        .withMessage("El numero de telefono debe tener mas de 3 digitos"),
    
    body('last_name')
        .notEmpty()
        .withMessage("El campo apellido no debe estar vacio")
        .isLength({ min: 3 }) 
        .withMessage("El Apellido debe tener minimo 3 caracteres"),
        
    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("Formato inválido")
        .custom(async(value, { req }) => {
            const user = await db.User.findOne({where: {email:req.body.email}})
    
          if (user) {
            return false;
          }
          return true;
        })
        .withMessage("El email ya se encuentra registrado"),

    body("password").isLength({
            min: 6,
          })
        .withMessage("Tu constraseña debe tener minimo 6 caracteres")  ,
];

const validacion = (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors.mapped());
    if (errors.isEmpty()) {
        next();
    } else {
        db.User.findOne({where: {email:req.body.email}})
        .then(user=>{
            res.render("editProfile", {
                errors: errors.mapped(),
                old:req.body,
                usuario:user
            });
        })
        
    }
};

module.exports = {
    validaciones,
    validacion
};