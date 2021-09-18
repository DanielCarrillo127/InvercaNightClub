const { response } = require('express');

const validationCasherRole = (req, res = response, next) => {

    
    if(!req.user) {
        return res.status(500).json({ 
            msg: 'Must check rol first'
        })
    }

    const { role} = req.user;

    console.log(role)

    if(role == 4){
        return res.status(401).json({
            msg: 'You are not Casher User'
        })
    }   

    next();
}


module.exports = {
    validationCasherRole
}