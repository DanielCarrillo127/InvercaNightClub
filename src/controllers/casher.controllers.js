const moment = require('moment');

const Cart = require('../models/cart.models');
const Orders = require('../models/orders.models');
const Customer = require('../models/customer.models');
const Product = require('../models/product.models');
const { dbConnection } = require('../../config/database/config.database');

const insertOrder = 'INSERT INTO orders (customerid, datecreated, ordertype,paytypeid, paycomplement, total) VALUES($1, $2, $3, $4, $5, $6) returning orderid'
const insertCart = 'INSERT INTO cart (orderid, productid, quantity) VALUES($1, $2, $3) '
const update = 'UPDATE product SET quantity = $2 WHERE productid = $1'
const selectCustomer = 'SELECT * from customer where cedula = $1'
const selectCustomerid = 'SELECT * from customer where customerid = $1'
const updateCustomerBalance = 'UPDATE customer set currentbalance = $2 where cedula = $1'
const selectProducts = 'select * from product where productid in'
const delete2 = 'DELETE FROM orders where orderid = $1'

const insertCustomer = 'INSERT INTO customer (cedula, firstname, lastname, datecreated, phonenumber, credit, currentbalance) values ($1, $2, $3, $4, $5, $6, $7) returning customerid'

const pool = dbConnection();


//GET
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              GET CUSTOMER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const GetCustomer = async (req, res = response) => {
    const { cedula } = req.body;

    //Search Customer by CustomerId 
    let customer;
    await pool
        .query(selectCustomer, [cedula])
        .then(rest => {
            const auxCustomer = rest.rows[0];
            if (typeof auxCustomer != 'undefined') {
                //Login Customer
                customer = new Customer(auxCustomer.cedula, auxCustomer.firstname, auxCustomer.lastname, auxCustomer.datecreated, auxCustomer.phonenumber, auxCustomer.credit, auxCustomer.currentbalance, auxCustomer.customerid);
            }
        })
        .catch(e => {
            console.log(e.stack)
        });


    if (typeof customer == 'undefined') {
        //Create Customer
        return res.status(501).json({
            resp: 'This customer is not in the database, please register!',
            cedula: cedula
        })
    } else {
        return res.status(201).json({
            Customer: customer.toJSON2(),
            resp: 'Customer Login Success'
        })
    }

}

//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                             REGISTER CUSTOMER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const registerCustomer = async (req, res = response) => {
    const { cedula, firstName, lastName, phoneNumber, credit } = req.body;

    let auxCustomer;
    await pool
        .query(selectCustomer, [cedula])
        .then(rest => {
            auxCustomer = rest.rows[0];
        })
        .catch(e => {
            console.log(e.stack)
        });

    if (typeof auxCustomer != 'undefined') {
        return res.status(501).json({
            resp: 'this customer is already registered in the database'
        })
    }

    //Search Customer by CustomerId 
    let customer;
    const currentTime = new Date();
    let creditInt = parseInt(credit) * 5
    await pool
        .query(insertCustomer, [cedula, firstName, lastName, currentTime, phoneNumber, creditInt, creditInt])
        .then(rest => {
            const auxCustomer = rest.rows[0];

            // console.log("usuario encontrado: ",rest.rows[0])
            if (typeof auxCustomer !== 'undefined') {
                customer = new Customer(cedula, firstName, lastName, currentTime, phoneNumber, creditInt, creditInt, auxCustomer.customerid);
            }
        })
        .catch(e => {
            console.log(e.stack)
        });

    if (typeof customer == 'undefined') {
        //Create Customer
        return res.status(501).json({
            resp: 'There is an error in the backend!'
        })
    } else {
        return res.status(201).json({
            Customer: customer.toJSON2(),
            resp: 'Customer Login Success'
        })
    }

}

//POST
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              ADD ORDERS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const addOrders = async (req, res = response) => {
    const { customerid, cart, ordertype, paytype, paycomplement, total } = req.body;

    let now = moment().format();

    //Create the model ORDER
    const orders = new Orders(customerid, now, ordertype, paytype, paycomplement, total, undefined);


    if (ordertype === "Crédito") {
        let customerOrder;
        await pool
            .query(selectCustomerid, [customerid])
            .then(rest => {
                customerOrder = rest.rows[0];
            })
            .catch(e => {
                console.log(e.stack)
            });
        if (customerOrder.currentbalance >= total) {
            //Insert ORDER into database
            let auxOrderId;
            await pool
                .query(insertOrder, orders.toList())
                .then(rest => {
                    auxOrderId = rest.rows[0];
                })
                .catch(e => {
                    console.log(e.stack)
                });

            if (typeof auxOrderId != 'undefined') {
                orders.setOrderId(auxOrderId.orderid)
            } else {
                return res.status(500).json({
                    msg: 'Error in the database process please check your settings',
                    err: e.stack
                })
            }

            //Create the model CART
            let listProductsId = [];
            cart.forEach(product => {
                listProductsId.push(product.productId);
            });

            //Verify if the product exists
            exist = true;
            let products = []
            await pool
                .query(`${selectProducts} (${listProductsId})`)
                .then(rest => {
                    if (typeof rest.rows == 'undefined' || rest.rows.length != listProductsId.length) {
                        exist = false;
                    } else {
                        for (let i = 0; i < rest.rows.length; i++) {
                            if (rest.rows[i] == 'undefined') {
                                res.status(400).json({
                                    msg: 'These no products on the database'
                                })
                            }
                            let auxProduct = rest.rows[i];
                            let product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.datecreated, auxProduct.updatedatecreated, auxProduct.category, auxProduct.image, auxProduct.productid);

                            products[i] = product
                        }
                    }
                })
                .catch(e => {
                    return res.status(500).json({
                        msg: 'Error in the database process please check your settings',
                        err: e.stack
                    })
                });


            if (exist) {
                cart.forEach(async product => {
                    let cart2 = new Cart(orders.getOrderId(), product.productId, product.quantity, undefined);
                    let num;

                    for (let i = 0; i < products.length; i++) {
                        if (products[i].getProductId() === product.productId) {
                            let inv = products[i].getQuantity() - product.quantity;
                            if (inv < 0) {
                                return res.status(500).json({
                                    msg: 'To much product, we do not have enough',
                                })
                            } else {
                                products[i].setQuantity(inv);
                                num = i;
                            }

                        }
                    }

                    //Update quantity on PRODUCT
                    await pool
                        .query(update, [products[num].getProductId(), products[num].getQuantity()])
                        .then(rest => {

                            console.log('Update product: ' + product.productId);
                        })
                        .catch(e => {
                            console.log(e.stack)
                        });

                    //Update customer currentbalance
                    let UpdateBalance = customerOrder.currentbalance - total
                    await pool
                        .query(updateCustomerBalance, [customerOrder.cedula, UpdateBalance])
                        .then(rest => {

                            console.log('Update Balance');
                        })
                        .catch(e => {
                            console.log(e.stack)
                        });

                    //Insert CART into database
                    await pool
                        .query(insertCart, cart2.toList())
                        .then(rest => {
                            // console.log('Insert on: ' + auxOrderId.orderid);
                            return res.status(201).json({
                                resp: 'Order created successfully'
                            })
                        })
                        .catch(e => {
                            console.log(e.stack)
                        });
                });


                orders.setOrderId(auxOrderId.orderid);
            } else {

                await pool
                    .query(delete2, [orders.getOrderId()])
                    .then(rest => {
                        console.log('Error Controlled', rest.rows[0]);
                    })
                    .catch(e => {

                    });

                return res.status(501).json({
                    resp: 'Error Controlled one product do not exists'
                })

            }
        } else {
            res.status(400).json({
                msg: 'El cliente no cuenta con saldo suficiente para realizar la compra'
            })
        }

    } else if (ordertype === "De_contado") {
        //Insert ORDER into database
        let auxOrderId;
        await pool
            .query(insertOrder, orders.toList())
            .then(rest => {
                auxOrderId = rest.rows[0];
            })
            .catch(e => {
                console.log(e.stack)
            });

        if (typeof auxOrderId != 'undefined') {
            orders.setOrderId(auxOrderId.orderid)
        } else {
            return res.status(500).json({
                msg: 'Error in the database process please check your settings',
                err: e.stack
            })
        }

        //Create the model CART
        let listProductsId = [];
        cart.forEach(product => {
            listProductsId.push(product.productId);
        });

        //Verify if the product exists
        exist = true;
        let products = []
        await pool
            .query(`${selectProducts} (${listProductsId})`)
            .then(rest => {
                if (typeof rest.rows == 'undefined' || rest.rows.length != listProductsId.length) {
                    exist = false;
                } else {
                    for (let i = 0; i < rest.rows.length; i++) {
                        if (rest.rows[i] == 'undefined') {
                            res.status(400).json({
                                msg: 'These no products on the database'
                            })
                        }
                        let auxProduct = rest.rows[i];
                        let product = new Product(auxProduct.proname, auxProduct.price, auxProduct.quantity, auxProduct.datecreated, auxProduct.updatedatecreated, auxProduct.category, auxProduct.image, auxProduct.productid);

                        products[i] = product
                    }
                }
            })
            .catch(e => {
                return res.status(500).json({
                    msg: 'Error in the database process please check your settings',
                    err: e.stack
                })
            });


        if (exist) {
            cart.forEach(async product => {
                let cart2 = new Cart(orders.getOrderId(), product.productId, product.quantity, undefined);
                let num;

                for (let i = 0; i < products.length; i++) {
                    if (products[i].getProductId() === product.productId) {
                        let inv = products[i].getQuantity() - product.quantity;
                        if (inv < 0) {
                            return res.status(500).json({
                                msg: 'To much product, we do not have enough',
                            })
                        } else {
                            products[i].setQuantity(inv);
                            num = i;
                        }

                    }
                }

                //Update quantity on PRODUCT
                await pool
                    .query(update, [products[num].getProductId(), products[num].getQuantity()])
                    .then(rest => {

                        console.log('Update product: ' + product.productId);
                    })
                    .catch(e => {
                        console.log(e.stack)
                    });


                //Insert CART into database
                await pool
                    .query(insertCart, cart2.toList())
                    .then(rest => {
                        console.log('Insert on: ' + auxOrderId.orderid);
                        return res.status(201).json({
                            resp: 'Order created successfully'
                        })
                    })
                    .catch(e => {
                        console.log(e.stack)
                    });
            });

            orders.setOrderId(auxOrderId.orderid);
        } else {

            await pool
                .query(delete2, [orders.getOrderId()])
                .then(rest => {
                    console.log('Error Controlled', rest.rows[0]);
                })
                .catch(e => {

                });

            return res.status(501).json({
                resp: 'Error Controlled one product do not exists'
            })

        }
    } else {
        res.status(400).json({
            msg: 'Error ordertype is Empty'
        })
    }

}

//                                                                                              Update Customer Balance
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
const UpdateCustomerBalance = async (req, res = response) => {
    const { cedula, amount } = req.body;

    //Search Customer by CustomerId 
    let customer;
    await pool
        .query(selectCustomer, [cedula])
        .then(rest => {
            const auxCustomer = rest.rows[0];
            if (typeof auxCustomer != 'undefined') {
                //Login Customer
                customer = new Customer(auxCustomer.cedula, auxCustomer.firstname, auxCustomer.lastname, auxCustomer.datecreated, auxCustomer.phonenumber, auxCustomer.credit, auxCustomer.currentbalance, auxCustomer.customerid);
            }
        })
        .catch(e => {
            console.log(e.stack)
        });

    console.log(customer)

    if (typeof customer == 'undefined') {
        //Create Customer
        return res.status(501).json({
            resp: 'This customer is not in the database, please register!',
            cedula: cedula
        })
    } else {
        
        let newBalance = customer.getCurrentbalance() + parseInt(amount);
        await pool
            .query(updateCustomerBalance, [cedula, newBalance])
            .then(rest => {
                return res.status(201).json({
                    Customer: customer.toJSON2(),
                    resp: 'Customer Balance Update'
                })
            })
            .catch(e => {
                console.log(e.stack)
                return res.status(501).json({
                    resp: 'There is an error in the backend!'
                })
            })
    }

}





module.exports = {
    addOrders,
    GetCustomer,
    registerCustomer,
    UpdateCustomerBalance
}