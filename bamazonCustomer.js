var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table')

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`)
    showCatalog();
    connection.end();
})

function menu() {
    inquirer.prompt([{
        name: "selection",
        message: "What would you like to buy?",
        type: "input",
        validate: function (value) {
            if (!isNaN(value)) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function (answer) {
        console.log(answer.selection)
        // Then ask for how many they would like to buy
    })
}


function showCatalog() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ['ID', 'Product Name', 'Department Name', 'Price', 'Stock']
            , colWidths: [5, 40, 40, 10, 15]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity]);
        }
        console.log(table.toString());
        menu();
    })
};