const { dbConnection } = require('../../config/database/config.database');


const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx')
const fs = require("fs");

const serviceAccount = require('../../invercafarra-firebase-adminsdk-107xl-54640ca941.json');
const admin = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});
const storageRef = admin.storage().bucket(`gs://invercafarra.appspot.com`);



const Orders = require('../models/orders.models');

const selectAll = 'select * from orders';
const selectOrders = 'select * from orders_table()';
const selectWeekday = 'select * from weekday_product()';
const selectPie = 'select * from pie_graph_product()';
const selectSells = 'select * from total_sells_day()';
const deleteQuery2 = 'DELETE FROM orders WHERE orderid = $1';
const deleteQuery3 = 'DELETE FROM cart WHERE orderid = $1';

const updateCustomerBalance = 'UPDATE customer set currentbalance = $2 where cedula = $1'

const liquidateQuery = `SELECT DISTINCT cus.customerid, cus.cedula, cus.firstName, cus.lastName, cus.phoneNumber, cus.credit, cus.currentbalance, CASE WHEN EXISTS ( SELECT tran.customerid FROM transaction as tran WHERE tran.customerid = ord.customerid AND tran.transactiontype = 4 ) THEN'Compras a Crédito'WHEN NOT EXISTS ( SELECT tran.customerid FROM transaction as tran WHERE tran.customerid = ord.customerid AND tran.transactiontype = 4 ) THEN'Compras de contado'END AS usecredit,'null' AS Profits,'null' AS finalbalance FROM customer AS cus INNER JOIN orders AS ord ON ord.customerid = cus.customerid`;



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
                } else {
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
                } else {
                    let week = rest.rows[i];
                    let day;
                    switch (week.weekday) {
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
                } else {
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

//                                                                                              GET EARNED TODAY NUMBER
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

const EarnDay = async (req, res = response) => {
    const pool = dbConnection();
    let data = 0;
    await pool
        .query(selectSells)
        .then(rest => {
            data = rest.rows[0];
            if (data == null) {
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


const liquidateContributions = async (req, res = response) => {


    const pool = dbConnection();
    let data = [];

    //data with the users and the distinction of useCredit
    await pool
        .query(liquidateQuery)
        .then(rest => {
            data = rest.rows;

        })
        .catch(e => console.error(e.stack));

    //apply the % for every case
    data.forEach(function (customer) {
        //1st Use Case -liquidate Contributions
        if (customer.usecredit === "Compras a Crédito") {
            customer.profits = (customer.credit / 5) * 0.03;
            customer.finalbalance = customer.currentbalance + customer.profits;
            // 2nd Use Case - Credit liquidation
            // if (customer.currentbalance !== customer.credit) {
            //     const CreditLiq = customer.currentbalance * 0.03;
            //     customer.finalbalance = customer.currentbalance - CreditLiq;
            //     customer.Aplicaliq_Credito = 'si';
            // } else {
            //     customer.Aplicaliq_Credito = 'no';
            // }
        } else {
            customer.profits = (customer.credit / 5) * 0.06;
            customer.finalbalance = customer.currentbalance + customer.profits;
        }

        if (customer.finalbalance < customer.credit) {
            updatebalence(customer.cedula, customer.finalbalance)
        }
    })

    //clean Data from the json
    const CleanData = data.map(({
        customerid: idCliente, cedula: Cedula ,firstname: Nombre, lastname: Apellidos, phonenumber: NumTelefono, credit: CupoMaximo, currentbalance: SaldoActual, usecredit: UsoCredito, profits:  Beneficios, finalbalance: SaldoFinal}) => ({
            idCliente,
            Cedula,
            Nombre,
            Apellidos,
            NumTelefono,
            CupoMaximo,
            SaldoActual,
            UsoCredito,
            Beneficios,
            SaldoFinal
        }));

    //set the correct date for the liquidation
    const current = new Date();
    current.setMonth(current.getMonth() - 1);
    const previousMonth = current.toLocaleString('default', { month: 'long' });
    const filename = `liquidación_${previousMonth}_${current.getFullYear()}`
    //convert array to excel file
    convertJsonToExcel(CleanData, filename)

    const url = await uploadFile(`./${filename}.xlsx`, `${filename}.xlsx`);

    //deleteFile From the API
    const path = `./${filename}.xlsx`;
    try {
        fs.unlinkSync(path);
        console.log("File removed:", path);
    } catch (err) {
        console.error(err);
    }

    //return the final table
    res.json({
        url: url
    })

}

async function uploadFile(path, filename) {

    // Upload the File
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `liquidate/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });


    return storage[0].metadata.mediaLink;
}

async function updatebalence(cedula, newBalance) {
    const pool = dbConnection();
    await pool
        .query(updateCustomerBalance, [cedula, newBalance])
        .then(
            console.log('update balence sucessfully')
        )
        .catch(e => {
            console.log(e.stack)
            return res.status(501).json({
                resp: 'There is an error in the backend!'
            })
        })

}

const convertJsonToExcel = (json, filename) => {
    const workSheet = XLSX.utils.json_to_sheet(json);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, filename)
    //Generate buffer
    XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' })
    //Binary string
    XLSX.write(workBook, { bookType: 'xlsx', type: 'binary' })
    XLSX.writeFile(workBook, `${filename}.xlsx`)
}


module.exports = {
    getOrders,
    deleteOrders,
    EarnDay,
    getMonthCost,
    PieGraph,
    weekdaygraph,
    TableLastOrders,
    liquidateContributions
}