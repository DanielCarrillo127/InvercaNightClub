const { Router } = require('express');
// const { check } = require('express-validator');

const router = Router();

const { 
    deleteOrders,
    getOrders,
    EarnDay,
    getMonthCost,
    PieGraph,
    weekdaygraph,
    TableLastOrders
    } = require('../controllers/admin.controllers');
const { validation,
    validationJWT,
    // validationAdminRole
} = require('../middleware/index')


router.delete('/deleteOrders', [
    validationJWT,
    // validationAdminRole,
    validation
],deleteOrders);

router.get('/getOrders/', [
    validationJWT,
    // validationAdminRole,
    validation
],getOrders);

router.get('/tablelastorders/', [
    validationJWT,
    // validationAdminRole,
    validation
],TableLastOrders);


router.get('/weekdaygraph/', [
    validationJWT,
    // validationAdminRole,
    validation
],weekdaygraph);

router.get('/piegraph/', [
    validationJWT,
    // validationAdminRole,
    validation
],PieGraph);

router.get('/getMonthCost/', [
    validationJWT,
    // validationAdminRole,
    validation
],getMonthCost);

router.get('/earnday/', [
    validationJWT,
    // validationAdminRole,
    validation
],EarnDay);



module.exports = router;