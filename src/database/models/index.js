// src/database/models/index.js
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
import config from '../config/config.js'; 
const dbConfig = config[env];  

const db = {};
let sequelize;

if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        port: dbConfig.port,
        logging: console.log,
    });
}

// Cargar modelos
fs
  .readdirSync(__dirname)
  .filter(file => {
      return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js' &&
          file.indexOf('.test.js') === -1
      );
  })
  .forEach(async (file) => {
      const filePath = new URL(file, import.meta.url).pathname; // Convierte a una ruta válida
      const modelImport = await import(filePath); // Importa el modelo de forma dinámica
      console.log(`Modelo importado de ${file}:`, modelImport); // Verifica lo que se está importando

      const model = modelImport.default; // Accede al modelo
      // Verifica que model sea una función
      if (typeof model === 'function') {
          const modelInstance = model(sequelize, DataTypes); // Inicializa el modelo con sequelize
          db[modelInstance.name] = modelInstance; // Agrega el modelo usando su nombre
          console.log(`Modelo cargado: ${modelInstance.name}`); // Esto debería imprimir "User"
      } else {
          console.error(`El modelo ${file} no es una función.`);
      }
  });




Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
