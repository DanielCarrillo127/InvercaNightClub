const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { 
    userUpdate,
    userRegister,
    userLogin,
     } = require('../controllers/user.controllers');
const { verifyEmail, verifyUsername } = require('../helpers/db-validators');
const { validation } = require('../middleware/validation');
const { validationJWT } = require('../middleware/validation-jwt');



router.put('/:username', [
    check('cedula', 'username is required').not().isEmpty(),
    check('firstName', 'firstname is required').not().isEmpty(),
    check('lastName', 'lastname is required').not().isEmpty(),
    check('password', 'password is required, minimum 6 characters required').not().isEmpty().isLength({ min: 6 }),
    check('email', 'Email is not valid').isEmail(),
    validationJWT,
    validation
],userUpdate);

router.post('/login', [
    check('cedula', 'cedula is required').not().isEmpty(),
    validation
],userLogin );

router.post('/', [
    check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required, minimum 6 characters required').not().isEmpty().isLength({ min: 6 }),
    check('email', 'Email is not valid').isEmail(),
    check('email', 'Email already exist').custom(verifyEmail),
    check('username', 'Username already exist').custom(verifyUsername),
    validation
], userRegister);


module.exports = router;