class Product {

    productid;
    proname;
    price;
    quantity;
    datecreated;
    updatedatecreated;
    category;
    image;

    constructor(proname, price, quantity,datecreated, updatedatecreated,category, image,productid) {

        this.productid = productid;
        this.proname = proname;
        this.price = price;
        this.quantity = quantity;
        this.datecreated = datecreated;
        this.updatedatecreated = updatedatecreated;
        this.category = category;
        this.image = image;
        
    }

    //Getters
    getProductId() {
        return this.productid;
    }

    getProname() {
        return this.proname;
    }

    getPrice() {
        return this.price;
    }

    getQuantity() {
        return this.quantity;
    }

    getDatecreated() {
        return this.datecreated;
    }

    getUpdatedatecreated() {
        return this.updatedatecreated;
    }

    getCategory() {
        return this.category;
    }

    getImage() {
        return this.image;
    }

    //Setters
    setProname(proname) {
        this.proname = proname;
    }

    setPrice(price) {
        this.price = price;
    }

    setQuantity(quantity) {
        this.quantity = quantity;
    }

    setDatecreated(datecreated) {
        this.datecreated = datecreated;
    }

    setUpdatedatecreated(updatedatecreated) {
        this.updatedatecreated = updatedatecreated;
    }

    setCategory(category) {
        this.category = category;
    }

    setImage(image) {
        this.image = image;
    }

    //To JSON

    toJSON() {
        return JSON.parse(JSON.stringify({
            productid: this.productid,
            proname: this.proname,
            price: this.price,
            quantity: this.quantity,
            datecreated: this.datecreated,
            updatedatecreated: this.updatedatecreated,
            category: this.category,
            image: this.image
        }))
    }

    //Value
    toValue() {
        return [`productId: ${this.productid}`, `proname: ${this.proname}`, `Price: ${this.price}`, `Quantity: ${this.quantity}`,`datecreated: ${this.datecreated}`, `updatedatecreated: ${this.quanupdatedatecreatedtity}` ,`Category: ${this.category}`, `Image: ${this.image}`]
    }

    //List
    toList() {
        return [this.productid, this.proname, this.price, this.quantity, this.datecreated, this.updatedatecreated,this.category, this.image];
    }

    //List No id
    toList2() {
        return [this.proname, this.price, this.quantity, this.datecreated, this.updatedatecreated, this.category, this.image];
    }

}

module.exports = Product;