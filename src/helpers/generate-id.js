

const generateIdUser = (role,firstName,lastName,cedula) =>{
    const randomizer = Math.floor(Math.random() * 90 + 10); 
    const id = role + firstName.substring(0,1) + lastName.substring(0,1) + cedula.substring(0,3) + randomizer;
    return id;
}

const generateIdProducts = (proname,category ) => {
    const randomizer = Math.floor(Math.random() * 90 + 10); 
    const randomizer2 = Math.floor(Math.random() * 90 + 10); 
    const id = randomizer + proname.substring(0,3) + randomizer2 + category.substring(0,3);
    return id;
}

module.exports = {
    generateIdProducts, generateIdUser
}


