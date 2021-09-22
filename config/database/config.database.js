const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL
// const passwordDB = process.env.passwordDB

function dbConnection() {

    try {
        const pool = new Pool({
            // database: 'InvercaDB',
            // user: 'postgres',
            // password: passwordDB,
            // port: 5432,
            // // ssl: {
            // //     rejectUnauthorized: false
            // // },
            // max: 20
            connectionString,
             ssl: {
                 rejectUnauthorized: false
             },
             max: 20
        })
        console.log('Connected Database')
        return pool;

    } catch (error) {
        console.log(error);
        throw new Error('Database Connection Error')
    }

}

module.exports = {
    dbConnection
}




