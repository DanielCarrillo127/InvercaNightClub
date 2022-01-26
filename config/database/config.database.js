const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL
// const database = process.env.database
// const user = process.env.user
// const port = process.env.portdb
// const passwordDB = process.env.passwordDB

function dbConnection() {

    try {
        const pool = new Pool({
            // database: database,
            // user: user,
            // password: passwordDB,
            // port: port,
            // ssl: {
            //     rejectUnauthorized: false
            // },
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




