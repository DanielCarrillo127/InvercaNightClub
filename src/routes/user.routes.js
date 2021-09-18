const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const { userLogin } = require('../controllers/users.controllers');
const { userRegister } = require('../controllers/users.controllers');
const { validation } = require('../middleware/index')


router.post('/', [
    check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required').not().isEmpty(),
    validation
], userLogin );

router.post('/register', [
    check('username', 'username is required').not().isEmpty(),
    check('password', 'password is required, minimum 6 characters required').not().isEmpty().isLength({ min: 6 }),
    check('role', 'role is not valid').not().isEmpty(),
    validation
], userRegister);


module.exports = router;