class Customer {

    //Attributes of user
    customerId;
    cedula;
    firstName;
    lastName;
    datecreated; 
    phoneNumber;
    credit;
    currentbalance;

    //Constructors
    constructor(cedula, firstName, lastName, datecreated,phoneNumber,credit, currentbalance,customerId) {

        this.customerId = customerId;
        this.cedula = cedula;
        this.firstName = firstName;
        this.lastName = lastName;
        this.datecreated = datecreated;
        this.phoneNumber = phoneNumber;
        this.credit = credit;
        this.currentbalance = currentbalance;
    }

    //Getters

    getCustomerId() {
        return this.customerId;
    }

    getCedula() {
        return this.cedula;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getDatecreated () {
        return this.datecreated;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }
    getCredit() {
        return this.credit;
    }
    getCurrentbalance() {
        return this.currentbalance;
    }

    //Setters


    //To JSON
    toJSON() {
        return JSON.parse(JSON.stringify({
            cedula: this.cedula,
            name: this.firstName + ' ' + this.lastName,
            datecreated: this.datecreated,
            phoneNumber: this.phoneNumber,
            credit:this.credit,
            currentbalance:this.currentbalance
        }))
    }

    toJSON2() {
        return JSON.parse(JSON.stringify({
            customer: this.customerId,
            cedula: this.cedula,
            name: this.firstName + ' ' + this.lastName,
            datecreated: this.datecreated,
            phoneNumber: this.phoneNumber,
            credit:this.credit,
            currentbalance:this.currentbalance
        }))
    }


    toValue() {
        return [`cedula: ${this.cedula}`, `firstName: ${this.firstName}`, `lastName: ${this.lastName}`, 
        `datecreated: ${this.datecreated}`, `phoneNumber: ${this.PhoneNumber}`, `credit: ${this.credit}`,
        `currentbalance: ${this.currentbalance}`
        ]
    }

    toList() {
        return [this.cedula, this.firstName, this.lastName, this.datecreated,this.phoneNumber, this.credit, this.currentbalance]
    }

}

module.exports = Customer;