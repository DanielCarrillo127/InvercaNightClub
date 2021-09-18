class User {

    //Attributes of user
    userId;
    username;
    password;
    role;

    //Constructors
    constructor(username, password, role,userId) {

        this.userId = userId;
        this.username = username;
        this.password = password;
        this.role = role;

    }

    //Getters

    getUserId() {
        return this.userId;
    }

    getUsername() {
        return this.username;
    }

    getPassword() {
        return this.password;
    }

    getRole() {
        return this.role;
    }

    //Setters


    setUsername(username) {
        this.username = username;
    }

    setPassword(password) {
        this.password = password;
    }

    setRole(role) {
        this.role = role;
    }


    //To JSON
    toJSON() {
        
        return JSON.parse(JSON.stringify({
            userId: this.userId,
            username: this.username,
            password: this.password,
            role: this.role
        }))
    }

    toValue() {
        return [`username: ${this.username}`, `password: ${this.password}`, `role: ${this.role}`]
    }

    toList() {
        return [this.username,this.password, this.role]
    }

}

module.exports = User;