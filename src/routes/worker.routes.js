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
    editQuantity
} = require('../controllers/worker.controllers');

router.post('/addProduct',[
    check('proname', 'name is required').not().isEmpty(),
    check('price', 'name is required').not().isEmpty(),
    check('quantity', 'name is required').not().isEmpty(),
    check('category', 'name is required').not().isEmpty(),
    check('image', 'name is required').not().isEmpty(),
    validationJWT,
    // validationWorkerRole,
    validation
], addProduct);

router.delete('/deleteProduct',[
    validationJWT,
    // validationWorkerRole,
    validation
], deleteProduct);

router.put('/editPrice',[
    validationJWT,
    // validationWorkerRole,
    validationProduct,
    validation
], editPrice);

router.put('/editQuantity',[
    validationJWT,
    // validationWorkerRole,
    validationProduct,
    validation
], editQuantity);

module.exports = router;