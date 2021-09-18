const bcryptjs = require('bcryptjs');

const { generateJWT } = require('../helpers/generate-jwt');
const User = require('../models/user.models');
const { dbConnection } = require('../../config/database/config.database');

const select = 'select * from users where username = $1';

const insert = 'INSERT INTO users (username, password, role) VALUES($1, $2, $3)';

const pool = dbConnection();


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              LOGIN USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const userLogin = async (req, res = response) => {
    const pool = dbConnection();

    try {
        const { username, password } = req.headers;

        //Searching user
        let auxUser;
        await pool
            .query(select, [username])
            .then(res => {
                auxUser = res.rows[0]
                pool.end();
            })
            .catch(e => console.error(e.stack));

        //Verify if username exists
        if (typeof auxUser == 'undefined') {
            return res.json({
                msg: 'Username not found'
            })
        }
        const user = new User(auxUser.username, auxUser.password, auxUser.role,auxUser.userId);

        //Verify password
        const validPassword = bcryptjs.compareSync(password, user.getPassword());
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Password is incorrect'
            });
        }

        //Generate JWT
        const token = await generateJWT(user.getUserId());

        res.status(200).json({
            user: user.toJSON(),
            token: token,
            resp: 'User Login Success'
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({
            msg: 'Important! Please contact with support'
        });
    }

}

//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              REGISTER USER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const userRegister = async (req, res = response) => {
    const { username, password, role } = req.body;
    const user = new User(username, password, role, undefined);

    //Encrypt password
    const salt = bcryptjs.genSaltSync();
    user.setPassword(bcryptjs.hashSync(user.getPassword(), salt));

    //Insert user into database
    await pool
        .query(insert, user.toList())
        .then(res => {
            console.log(res.rows[0]);
        })
        .catch(e => console.error(e.stack));
        
    const token = await generateJWT(user.getUserId());
    res.json({
        msg: user.toValue(),
        resp: 'Usuario Registrado',
        token
    })

}


module.exports = {
    userLogin,
    userRegister
}