const { dbConnection } = require('../../config/database/config.database');
const Orders = require('../models/orders.models');

const selectAll = 'select * from orders';
const selectOrders = 'select * from orders_table()';
const selectWeekday = 'select * from weekday_product()';
const selectPie = 'select * from pie_graph_product()';
const selectSells = 'select * from total_sells_day()';
const deleteQuery2 = 'DELETE FROM orders WHERE orderid = $1';
const deleteQuery3 = 'DELETE FROM cart WHERE orderid = $1';




//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              GET ORDERS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getOrders = async (req, res = response) => {

    let orders = []
    const pool = dbConnection();
    await pool
        .query(selectAll)
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no orders on the database'
                    })
                }
                let AuxOrders = rest.rows[i];
                let order = new Orders(AuxOrders.orderid, AuxOrders.userid, AuxOrders.status, AuxOrders.shippingid, AuxOrders.datecreated, AuxOrders.dateshipped, AuxOrders.paytype, AuxOrders.subtotal, AuxOrders.total);
                orders[i] = order.toJSON();

            }
            //pool.end();
        })
        .catch(e => {
            console.error(e.stack);
            //pool.end();
        });

    //Show Orders
    res.json({
        orders
    })

}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              DELETE ORDER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const deleteOrders = async (req, res = response) => {
    const pool = dbConnection();
    const { orderid } = req.headers;

    if (typeof orderid == 'undefined') {
        return res.status(400).json({
            msg: 'You must send the orderid by headers'
        })
    }

    //Delete book into database
    await pool
        .query(deleteQuery3, [orderid])
        .then(rest => {
            console.log(rest.rows[0]);
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    await pool
        .query(deleteQuery2, [orderid])
        .then(rest => {
            console.log(rest.rows[0])
            return res.status(200).json({
                msg: 'Delete Success'
            })
        })
        .catch(e => console.error(e.stack));

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              lAST 7 ORDERS
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const TableLastOrders = async (req, res = response) => {
    
    const pool = dbConnection();
    let orders = []
    await pool
        .query(selectOrders)
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no orders on the database'
                    });
                }else{
                    let order = rest.rows[i];
                    let table = JSON.parse(JSON.stringify({
                        orderId: order.orderid,
                        cedula: order.cedula,
                        firstName: order.firstname,
                        lastName: order.lastname,
                        dateCreated: order.datecreated,
                        payName: order.payname,
                        total: order.total
                    }))
                    orders[i] = table
                }

            }
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    //Show Orders
    res.json({
        orders
    })

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                               GET ALL WEEK SELL BIG GRAPH
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const weekdaygraph = async (req, res = response) => {
    const pool = dbConnection();

    let weeks = []
    await pool
        .query(selectWeekday)
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no orders on the database'
                    });
                }else{
                    let week = rest.rows[i];
                    let day;
                    switch (week.weekday){
                        case 1: 
                            day = 'Lunes';
                            break;
                        
                        case 2: 
                            day = 'Martes';
                            break;

                        case 3: 
                            day = 'Miercoles';
                            break;

                        case 4: 
                            day = 'Jueves';
                            break;

                        case 5: 
                            day = 'Viernes';
                            break;

                        case 6: 
                            day = 'Sabado';
                            break;

                        case 7:
                            day = 'Domingo';
                            break;
                    }
                    let weekend = JSON.parse(JSON.stringify({
                        xDay: day,
                        ySells: week.sells
                        
                    }))
                    weeks[i] = weekend
                }

            }
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    //Show Orders
    res.json({
        weeks
    })

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              GET PRODUCT BUYER GRAPH PIE
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const PieGraph = async (req, res = response) => {
    const pool = dbConnection();
    let pies = []
    await pool
        .query(selectPie)
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no orders on the database'
                    });
                }else{
                    let data = rest.rows[i];
                    let pie = JSON.parse(JSON.stringify({
                        proname: data.proname,
                        total: data.total
                        
                    }))
                    pies[i] = pie
                }

            }
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    //Show Orders
    res.json({
        pies
    })

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              GET MONTH COST GRAPH BAR
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const getMonthCost = async (req, res = response) => {
    const pool = dbConnection();
    let params = req.params;

    let orders = []
    await pool
        .query(selectAll, [params.status])
        .then(rest => {
            for (let i = 0; i < rest.rows.length; i++) {
                if (rest.rows[i] == 'undefined') {
                    res.status(400).json({
                        msg: 'These no orders on the database'
                    })
                }
                let AuxOrders = rest.rows[i];
                let order = new Orders(AuxOrders.orderid, AuxOrders.userid, AuxOrders.status, AuxOrders.shippingid, AuxOrders.datecreated, AuxOrders.dateshipped, AuxOrders.paytype, AuxOrders.subtotal, AuxOrders.total);
                orders[i] = order.toJSON();

            }
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    //Show Orders
    res.json({
        orders
    })

}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//                                                                                              GET EARNED TODAY NUMBER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const EarnDay = async (req, res = response) => {
    const pool = dbConnection();
    let data = 0;
    await pool
        .query(selectSells)
        .then(rest => {
            data = rest.rows[0];
            if (data == null){
                data = 0;
            }
            //pool.end();
        })
        .catch(e => console.error(e.stack));

    //Show Orders
    res.json({
        total: data
    })

}




module.exports = {
    getOrders,
    deleteOrders,
    EarnDay,
    getMonthCost,
    PieGraph,
    weekdaygraph,
    TableLastOrders
}