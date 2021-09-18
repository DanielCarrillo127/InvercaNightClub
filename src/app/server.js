const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../../config/database/config.database');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api';
        this.adminPath = '/api/admin';
        this.casherPath = '/api/casher';
        this.workerPath = '/api/worker';
        this.productPath = '/api/product';
        
        //database connection
        this.DBConnection();

        //middleware
        this.middleware();

        //routes
        this.routes();
    }

    DBConnection(){
        const pool = dbConnection();
    }

    routes() {
        this.app.use(this.userPath, require('../routes/user.routes'));
        this.app.use(this.adminPath, require('../routes/admin.routes'));
        this.app.use(this.casherPath, require('../routes/casher.routes'));
        this.app.use(this.workerPath, require('../routes/worker.routes'));
        this.app.use(this.productPath, require('../routes/product.routes'));
    }

    middleware(){
        //Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

    }

    listen () {
        this.app.listen(this.port , ()=> {
            console.log('listening on port', this.port);
        });
    }


}

module.exports = Server;