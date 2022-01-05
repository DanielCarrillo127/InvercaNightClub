
const generateIdUser = (role, firstName, lastName, cedula) => {
    const randomizer = Math.floor(Math.random() * 90 + 10);
    const id = role + firstName.substring(0, 1) + lastName.substring(0, 1) + cedula.substring(0, 3) + randomizer;
    return id;
}

const generateIdProducts = (proname, category) => {
    const randomizer = Math.floor(Math.random() * 90 + 10);
    const randomizer2 = Math.floor(Math.random() * 90 + 10);
    const id = randomizer + proname.substring(0, 3) + randomizer2 + category.substring(0, 3);
    return id;
}


const generateIdTransaction = (date, customerid, transactiontype) => {
    const randomizer = Math.floor(Math.random() * 90 + 10);
    var expresionRegular = /\s*-\s*/;
    var lista = date.toString().substring(0, 10).split(expresionRegular);
    const id = transactiontype + customerid.substring(0, 6) + lista[0] + lista[1] + lista[2] + randomizer;
    return id;
}

module.exports = {
    generateIdProducts, generateIdUser, generateIdTransaction
}


