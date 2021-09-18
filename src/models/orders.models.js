class Orders {

    orderId;
    customerId;
    dateCreated;
    ordertype;
    payTypeId;
    paycomplement;
    total;


    constructor(customerId, dateCreated, ordertype, payTypeId, paycomplement, total, orderId) {

        this.orderId = orderId;
        this.customerId = customerId;
        this.dateCreated = dateCreated;
        this.ordertype = ordertype;
        this.payTypeId = payTypeId;
        this.paycomplement = paycomplement;
        this.total = total;


    }

    //Getters
    getOrderId() {
        return this.orderId;
    }

    getCustomerId() {
        return this.userId;
    }

    getDateCreated() {
        return this.dateCreated;
    }

    getordertype() {
        return this.dateCreated;
    }

    getPayTypeId() {
        return this.payType;
    }

    getPaycomplement() {
        return this.paycomplement;
    }

    getTotal() {
        return this.total;
    }

    //Setters
    setOrderId(orderId) {
        this.orderId = orderId;
    }

    setCustomerId(customerId) {
        this.customerId = customerId;
    }

    setDateCreated(dateCreated) {
        this.dateCreated = dateCreated;
    }

    setOrdertype(ordertype) {
        this.ordertype = ordertype;
    }

    setPayTypeId(payTypeId) {
        this.payTypeId = payTypeId;
    }

    setPaycomplement(paycomplement) {
        this.paycomplement = paycomplement;
    }

    setTotal() {
        this.total = total;
    }

    //JSON
    //To JSON
    toJSON() {

        return JSON.parse(JSON.stringify({
            orderId: this.orderId,
            customerId: this.customerId,
            dateCreated: this.dateCreated,
            ordertype: this.ordertype,
            payTypeId: this.payTypeId,
            paycomplement: this.paycomplement,
            total: this.total
        }))
    }

    toList() {
        return [this.customerId, this.dateCreated, this.ordertype, this.payTypeId, this.paycomplement, this.total];
    }

    toValue() {
        return [`orderId: ${this.orderId}`, `customerId: ${this.customerId}`, `dateCreated: ${this.dateCreated}`,`ordertype: ${this.ordertype}`, `payTypeId: ${this.payTypeId}`, `paycomplement: ${this.paycomplement}`, `total: ${this.total}`]
    }


}

module.exports = Orders;