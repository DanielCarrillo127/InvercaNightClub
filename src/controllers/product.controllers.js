const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');

const selectCategory = 'select * from product where category = $1'
const selectAll = 'select * from product'
const selectCategory2 = 'select * from category where categoryname like $1'
const selectSearch = 'select * from product where proname like $1'
const insertCategory = 'insert into category (categoryname) values ( $1 );'
const selectCategoryAll = 'select * from category'







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
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    console.log("no products")
                    res.status(400).json({
                        msg: 'These no products on the database'
                    })
                }
                let auxProduct = rest.rows[i];
                let product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.datecreated, auxProduct.updatedatecreated,auxProduct.category, auxProduct.image, auxProduct.productid);
                products[i] = product.toJSON()

            }
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                               PRODUCT CATEGORY GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getCategoryProduct = async (req = request, res = response) => {
    const pool = dbConnection();
    let params = req.params;
    let products = []
    await pool
        .query(selectCategory, [params.category])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no products on the database'
                    })
                }
                let auxProduct = rest.rows[i];
                let product = new Product(auxProduct.productid, auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.category, auxProduct.image);
                products[i] = product.toJSON()

            }
            pool.end();
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              SEARCH PRODUCTS GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getSearchProduct = async (req = request, res = response) => {
    const pool = dbConnection();
    let params = req.params;

    let products = [];

    await pool
        .query(selectSearch, [`${params.search}%`])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no products on the database'
                    })
                }
                let auxProduct = rest.rows[i];
                let product = new Product(auxProduct.productid, auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.category, auxProduct.image);
                products[i] = product.toJSON();

            }
            pool.end();
        })
        .catch(e => console.error(e.stack));

    res.json({
        products
    })



}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                                GET CATEGORY GET  
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getCategory = async (req = request, res = response) => {
    const pool = dbConnection();

    let categories = []
    await pool
        .query(selectCategoryAll)
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no category on the database'
                    })
                }
                let auxCategory = rest.rows[i];

                categories[i] = JSON.parse(JSON.stringify({
                    categoryId: auxCategory.categoryid,
                    categoryName: auxCategory.categoryname
                }))

            }
            pool.end();
        })
        .catch(e => console.error(e.stack));

    res.json({
        categories
    })


}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                                GET CATEGORY GET  
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const addCategory = async (req, res = response) => {
    const pool = dbConnection();
    const { category } = req.body;

    //Search if exits
    sw = false;
    await pool
        .query(selectCategory2, [category])
        .then(rest => {
            if (rest.rows[0] == 'undefined') {
                sw = true;
            }
            pool.end();
        })
        .catch(e => console.error(e.stack));

    if (sw) {
        return res.status(400).json({
            msg: 'Ya exite una categoria'
        })
    } else {
        //Insert product into database
        await pool
            .query(insertCategory, [category])
            .then(rest => {
                console.log(rest.rows[0])
                return res.status(201).json({
                    msg: 'Product created successfully',
                    product: product.toValue()
                })
            })
            .catch(e => console.error(e.stack));

            return res.status(200).json({
                msg: 'Categoria Creada'
            })

    }
}



module.exports = {
    getSearchProduct,
    getCategoryProduct,
    getProduct,
    addCategory,
    getCategory

}