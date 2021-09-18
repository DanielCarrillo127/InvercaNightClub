const { Router } = require('express');
const { check } = require('express-validator');
const { validation,
    validationJWT,
} = require('../middleware/index')

const router = Router();

const { 
    addOrders,
    GetCustomer,
    registerCustomer,
    UpdateCustomerBalance
} = require('../controllers/casher.controllers');

router.post('/loginCustomer', [
    validationJWT,
    validation
], GetCustomer);

router.post('/registerCustomer', [
    validationJWT,
    validation
], registerCustomer);

router.post('/addOrders', [
    validationJWT,
    check('customerid', 'customerid is required').not().isEmpty(),
    check('cart', 'cart is required').not().isEmpty(),
    check('ordertype', 'ordertype is required').not().isEmpty(),
    check('paytype', 'paytype is required').not().isEmpty(),
    check('paycomplement','paycomplement is required').not().isEmpty(),
    check('total','total is required').not().isEmpty(),
    validation
], addOrders);

router.post('/UpdateCustomerBalance', [
    validationJWT,
    validation
], UpdateCustomerBalance);


module.exports = router;