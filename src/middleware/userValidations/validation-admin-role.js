const { response } = require('express');

const validationAdminRole = (req, res = response, next) => {


    if(!req.user) {
        return res.status(500).json({ 
            msg: 'Must check rol first'
        })
    }

    const {role} = req.user;

    if(role != 2){
        return res.status(401).json({
            msg: 'You are not Admin User'
        })
    }
        

    next();
}


module.exports = {
    validationAdminRole
}