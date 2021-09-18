
const validation = require('../middleware/validation');
const validationJWT = require('../middleware/validation-jwt');
const validationAdminRole = require('./userValidations/validation-admin-role');
const validationCasherRole = require('./userValidations/validation-casher-role');
const validationWorkerRole = require('./userValidations/validation-worker-role');
const validationOrder = require('../middleware/validation-order');
const validationProduct = require('../middleware/validation-product');


module.exports = {  
    ...validation,
    ...validationJWT,
    ...validationAdminRole,
    ...validationCasherRole,
    ...validationWorkerRole,
    ...validationOrder,
    ...validationProduct
}