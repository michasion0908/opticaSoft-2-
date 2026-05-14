
import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345', //Contraseña de la base de datos
    database: 'opticadb' //Nombre de la base de datos
});
