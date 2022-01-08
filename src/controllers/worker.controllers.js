const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');
const moment = require('moment');


const { generateIdProducts } = require('../helpers/generate-id');

const insert = 'INSERT INTO product (productid, proname, price, quantity, datecreated,updatedatecreated, category, image) VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning productid'
const deleteQuery = 'DELETE FROM product WHERE productid = $1'
const selectAll = 'select * from product'
const searchQuery = 'select * from product where productid = $1'
const updateQuantity = 'update product set quantity=$2, datecreated=$3, updatedatecreated=$4 where productid = $1'
const updatePrice = 'update product set price = $2 where productid = $1'





//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                               ADD PRODUCT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const addProduct = async (req, res = response) => {
    const pool = dbConnection();
    const { proname, price, quantity, category, image } = req.body;

    var intprice = parseInt(price)
    var intquantity = parseInt(quantity)

    // let now = moment().format('MMMM Do YYYY, h:mm:ss a');
    // console.log(now)
    const currentTime = new Date();

    // Create product id
    const productid = generateIdProducts(proname, category)

    const product = new Product(proname, intprice, intquantity, currentTime, undefined, category, image, productid);
    console.log(product)
    //Insert product into database
    await pool
        .query(insert, product.toList())
        .then(rest => {
            //pool.end();
            console.log('productid', rest)
            return res.status(201).json({
                msg: 'Product created successfully',
                product: product.toValue()
            })
        })
        .catch(e => console.error("fail catch addproduct --> :", e.stack));
}


//Delete
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              DELETE PRODUCT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteProduct = async (req = request, res = response) => {
    const pool = dbConnection();
    const { productid } = req.headers;
    if (typeof productid == 'undefined') {
        return res.status(400).json({
            msg: 'You must send productid by headers'
        })
    }

    //Delete book into database
    await pool
        .query(deleteQuery, [productid])
        .then(rest => {
            //pool.end();
            return res.status(200).json({
                msg: 'Delete Successfull'
            })
        })
        .catch(e => {
            return res.status(200).json({
                msg: 'Imposible to delete FKey Associated. Contact the Admin',
                error: e.stack
            })
        });

}

//PUT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                                  EDIT PRODUCT QUANTITY
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const editQuantity = async (req, res = response) => {
    const pool = dbConnection();

    const { productid, quantity } = req.body;
    const currentTime = new Date();
    console.log(currentTime)
    //Search the product in the database
    let product;
    let list;
    let auxProduct;

    await pool
        .query(searchQuery, [productid])
        .then(rest => {
            auxProduct = rest.rows[0];
            //pool.end();
            if (typeof auxProduct == 'undefined') {
                return res.status(400).json({
                    msg: 'This product is not in the database'
                })
            }

        })
        .catch(e => console.error(e.stack));
        
        console.log("auxProduct.updatedatecreated:",auxProduct)
        if(auxProduct.updatedatecreated == null){
            product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.datecreated, currentTime, auxProduct.category, auxProduct.image, auxProduct.productid);
        }else{
            product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.updatedatecreated, currentTime, auxProduct.category, auxProduct.image, auxProduct.productid);
        }

    //Update into models
    product.setQuantity(parseInt(quantity) + auxProduct.quantity);


    list = [product.getProductId(), product.getQuantity(), product.getDatecreated(), product.getUpdatedatecreated()];
    
    console.log(product)
    console.log(list)
    //Update into database
    await pool
        .query(updateQuantity, list)
        .then(rest => {
            console.log(rest.rows[0])
            //pool.end();
            return res.status(200).json({
                msg: 'Update Successfull'
            })
        })
        .catch(e => console.error(e.stack));


}

//PUT
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                                  EDIT PRODUCT PRICE
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const editPrice = async (req, res = response) => {
    const pool = dbConnection();

    const { productid, price } = req.body;

    //Search the product in the database
    let product;
    let list;
    let auxProduct;

    await pool
        .query(searchQuery, [productid])
        .then(rest => {
            auxProduct = rest.rows[0];
            //pool.end();
            if (typeof auxProduct == 'undefined') {
                return res.status(400).json({
                    msg: 'This product is not in the database'
                })
            }
            console.log("product in the database")
        })
        .catch(e => console.error(e.stack));

    product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity,auxProduct.datecreated, auxProduct.updatedatecreated, auxProduct.category, auxProduct.image, auxProduct.productid);

    //Update into models
    product.setPrice(price);


    list = [product.getProductId(), product.getPrice()];
    //Update into database
    await pool
        .query(updatePrice, list)
        .then(rest => {
            //pool.end();
            return res.status(200).json({
                msg: 'Update Successfull'
            })
        })
        .catch(e => console.error(e.stack));
}

//GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ALL PRODUCTS GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const getProduct = async (req = request, res = response) => {
    const pool = dbConnection();

    let products = []
    await pool
        .query(selectAll)
        .then(rest => {
            console.log(rest)
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no products on the database'
                    })
                }

                console.log(rest.rows[i])
                let auxProduct = rest.rows[i];

                let product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.datecreated, auxProduct.updatedatecreated, auxProduct.category, auxProduct.image, auxProduct.productid);

                products[i] = product.toJSON()

            }
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })

}

module.exports = {
    addProduct,
    deleteProduct,
    editPrice,
    editQuantity,
    getProduct
}