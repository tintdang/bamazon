var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
})

//connect to connection
connection.connect(function (err) {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`)
    menu();
})
function menu() {
    console.log("Main Menu:")
    inquirer.prompt([
        {
            name: "menuOption",
            message: "What would you like to do?",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (response) {
        console.log(response.menuOption);
        switch (response.menuOption) {
            case "View Products for Sale":
                console.log("Case 1");
                viewProducts();
                break;
            case "View Low Inventory":
                console.log("Case 2");
                break;
            case "Add to Inventory":
                console.log("Case 3");
                break;
            case "Add New Product":
                console.log("Case 4");
                break;
        }
    })
}
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: ['ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colWidths: [5, 40, 40, 10, 15]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity])
        }
        console.log(table.toString());

        //back to menu
        menu();
    })
}