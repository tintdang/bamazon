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
                lowProducts();
                break;
            case "Add to Inventory":
                addInventory();
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

function lowProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        // make table, it will only print if it finds any stock
        var table = new Table({
            head: ['ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colWidths: [5, 40, 40, 10, 15]
        });

        // check each stock count
        for (var i = 0; i < res.length; i++) {
            var stock = res[i].stock_quantity;
            if (stock < 5) {
                // table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity])
                table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity]);
            }
        }

        // print if the table has anything its length
        if (table.length > 0) {
            console.log(table.toString());
            // return to menu
            menu();
        } else { // if there is nothing low in stock
            console.log("Nothing is currently low on stock")
            // return to menu
            menu();
        }
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res){
        if (err) throw err;
        console.log(res)

        // ask the question
        inquirer.prompt([
            {
                name: "item",
                message: "What item would you like to add inventory to?",
                type: "input",
                validate: function(value){
                    if(parseInt(value) > res.length){
                        console.log("\nThat is not a valid input, please enter a valid ID number")
                        return false;
                    }
                    else if(!isNaN(value) && (parseInt(value) > 0)){
                        return true;
                    }
                    else{
                        console.log("\nThat is not a valid input, try again")
                        return false;
                    }
                }
            }
        ]).then(function(response){
            console.log(response.item)
            // ask how many they would like to add to that inventory
            inquirer.prompt([{
                name: "stockIncrease",
                message: "How many would you like to add?",
                type: "input",
                validate: function(value){
                    if(!isNaN(value) && (parseInt(value) > 0)){
                        return true;
                    }
                    else{
                        console.log("\nThat is not a valid input, please enter a number")
                        return false;
                    }
                }
            }]).then(function(answer){
                var addStock = answer.stockIncrease;
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: (res[parseInt(response.item - 1)].stock_quantity + parseInt(addStock))
                    },{
                        item_id: response.item
                    }
                ], function(err){
                    if (err) throw err;
                    console.log(`You added ${addStock} units of ${res[parseInt(response.item - 1)].product_name},\nReturning to menu...`)
                    menu();
                })
            })
        })
    })
}

