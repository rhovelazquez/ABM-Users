/**
 * 
 * @param {import('sequelize').Sequelize} sequelize 
 * @param {import('sequelize/types').DataTypes} dataTypes 
 * @returns 
 */ 

export default (sequelize, dataTypes) => {
    const alias = "User"; // Alias del modelo

    const cols = {
        id: {
            type: dataTypes.INTEGER, // Tipo de dato
            primaryKey: true, // Es clave primaria
            autoIncrement: true // Se auto-incrementa
        },
        name: {
            type: dataTypes.STRING // Tipo de dato
        },
        last_name: {
            type: dataTypes.STRING // Tipo de dato
        },
        email: {
            type: dataTypes.STRING // Tipo de dato
        },
        password: {
            type: dataTypes.STRING // Tipo de dato
        },
        password2: {
            type: dataTypes.STRING // Tipo de dato
        }
    };

    const config = {
        tableName: 'users', // Asegúrate de que el nombre de la tabla sea correcto
        timestamps: false // No usar marcas de tiempo
    };

    // Definir el modelo
    const User = sequelize.define(alias, cols, config);

    // Devolver el modelo
    return User; // Asegúrate de que solo devuelves el modelo
}


