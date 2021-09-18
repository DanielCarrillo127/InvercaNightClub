const { response } = require('express');
const { dbConnection } = require('../../config/database/config.database');

const select = 'SELECT * FROM product WHERE productid = $1'


const pool = dbConnection();


const validationProduct = async (req, res = response, next) => {

    const { productid } = req.body;

    let exists = true;
    await pool
        .query(select, [productid])
        .then(rest => {

            if (typeof rest.rows[0] == 'undefined') {
                exists = false;
            }
            //pool.end();
        })
        .catch(e => {
            //pool.end();
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        });
    
    if (!exists) {
        return res.status(406).json({
            msg: 'The product id do not exist',
            productId: productid
        })
    }

    next();
}


module.exports = {
    validationProduct
}