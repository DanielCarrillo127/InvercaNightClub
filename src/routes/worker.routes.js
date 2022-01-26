const { Router } = require('express');
const { check } = require('express-validator');
const { validation,
    validationJWT,
    validationProduct
} = require('../middleware/index')

const router = Router();

const { addProduct,
    deleteProduct,
    editPrice,
    editQuantity, 
    deleteCustomer
} = require('../controllers/worker.controllers');

router.post('/addProduct',[
    check('proname', 'name is required').not().isEmpty(),
    check('price', 'name is required').not().isEmpty(),
    check('quantity', 'name is required').not().isEmpty(),
    check('category', 'name is required').not().isEmpty(),
    check('image', 'name is required').not().isEmpty(),
    validationJWT,
    validation
], addProduct);

router.delete('/deleteCustomer',[
    validationJWT,
    check('cedula', 'cedula is required').not().isEmpty(),
    validation
], deleteCustomer);

router.delete('/deleteProduct',[
    validationJWT,
    validation
], deleteProduct);

router.put('/editPrice',[
    validationJWT,
    validationProduct,
    validation
], editPrice);

router.put('/editQuantity',[
    validationJWT,
    validationProduct,
    validation
], editQuantity);

module.exports = router;