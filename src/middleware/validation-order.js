const { response } = require('express');
const { dbConnection } = require('../../config/database/config.database');

const select = 'SELECT * FROM orders WHERE orderid = $1'


const pool = dbConnection();


const validationOrder = async (req, res = response, next) => {

    const { orderid, status } = req.headers;

    if (status > 4 || status < 0) {
        return res.status(406).json({
            msg: 'Must check status'
        })
    }

    let exists = true;
    await pool
        .query(select, [orderid])
        .then(rest => {
            if (typeof rest.rows[0] == 'undefined') {
                exists = false;
            }
            pool.end();
        })
        .catch(e => {
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        });

    if (!exists) {
        return res.status(406).json({
            msg: 'The order id do not exist',
            order: orderid
        })
    }


    next();
}


module.exports = {
    validationOrder
}