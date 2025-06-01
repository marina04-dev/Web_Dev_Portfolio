import mysql from 'mysql2'

const con = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'Marichat04!',
    database: process.env.DB_NAME || 'employees'
})

con.connect(function(err) {
    if (err) {
        console.log('Database Connection Error!');
    } else {
        console.log('Database Connected!');
    }
})

export default con;