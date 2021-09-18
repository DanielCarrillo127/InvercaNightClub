const { Router } = require('express');

const router = Router();

const { getProduct,
    getCategoryProduct,
    getSearchProduct,
    getCategory,
    addCategory
} = require('../controllers/product.controllers');



router.post('/addCategory', addCategory);

router.get('/getCategory', getCategory);

router.get('/getProduct', getProduct);

router.get('/getProduct/:category', getCategoryProduct);

router.get('/searchProduct/:search', getSearchProduct);


module.exports = router;