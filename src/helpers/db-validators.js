const { verify } = require('jsonwebtoken');
const { dbConnection } = require('../../config/database/config.database');

const findEmail = 'SELECT email FROM users WHERE email = ($1)'
const findUsername = 'SELECT username FROM users WHERE username = ($1)'
const findISBN = 'SELECT isbn FROM product WHERE isbn = ($1)'

const pool = dbConnection();

const verifyEmail = async (email = '') => {

    let auxEmail;
    await pool
        .query(findEmail, [email])
        .then(res => {
            auxEmail = res.rows[0];
        })
        .catch(e => console.error(e.stack));
    if (typeof auxEmail != 'undefined') {
        if (auxEmail.email === email) {
            throw new Error(`the email ${email} is already in use`)
        }
    }

}

const verifyUsername = async (username = '') => {

    let auxUsername;
    await pool
        .query(findUsername, [username])
        .then(res => {
            auxUsername = res.rows[0];
        })
        .catch(e => console.error(e.stack));

    if (typeof auxUsername != 'undefined') {
        if (auxUsername.username === username) {
            throw new Error(`the username ${username} is already in use`)
        }
    }

}


module.exports = {
    verifyEmail, verifyUsername
}