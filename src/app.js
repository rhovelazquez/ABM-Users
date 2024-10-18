import express from 'express';
import cookieParser from 'cookie-parser';
const app = express();


import routesUsers from './routes/userRoutes.js'
import routesAuth from './routes/userAuthRoutes.js'
const PORT = 3030;

app.listen(PORT , () => {
    console.log('Servidor corriendo en el puerto: ' + PORT);
});

app.use(express.json());
app.use(cookieParser())

app.use('/api/user', routesUsers);

app.use('/api',routesAuth)

