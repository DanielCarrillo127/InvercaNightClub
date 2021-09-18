class Cart{

    cartId;
    orderId;
    productId;
    quantity;

    constructor(orderId, productId, quantity, cartId){
        this.cartId = cartId;;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
    }

    //Getters
    getCartId() {
        return this.cartId;
    }

    getOrderId() {
        return this.orderId;
    }

    getProductId() {
        return this.productId;
    }

    getQuantity() {
        return this.quantity;
    }


    //Setters
    setOrderId(orderId) {
        this.orderId = orderId;
    }

    setProductId(productId) {
        this.productId = productId;
    }

    setQuantity(quantity) {
        this.quantity = quantity;
    }

    //Values
    toList() {
        return [this.orderId, this.productId, this.quantity]
    }



}

module.exports = Cart;