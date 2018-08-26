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
    // connection.end();
})

function menu(res) {
    inquirer.prompt([{
        name: "selection",
        message: "What item would you like to buy?\n\nEnter in the item ID number [Quit with Q]",
        type: "input",
        validate: function (value) {
            if (value.toUpperCase() === "Q"){
                return true;
            }
            else if (parseInt(value) > res) {
                console.log("That is not a valid id number, please enter a valid number")
                return false;
            }
            else if (!isNaN(value)) {
                return true;
                //If they put in a number higher than id amounts
            }
            else {
                console.log('That is not a number, please enter a number')
                return false;
            }
        },
    }]).then(function (answer) {
        if(answer.selection.toUpperCase() === "Q"){
            console.log("Thanks for coming by! Come again next time!")
            return connection.end()
        }
        // Then ask for how many they would like to buy
        purchase(answer.selection);
    })
}


function showCatalog() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        
        //utilizes cli-tables to print out the ids
        var table = new Table({
            head: ['ID', 'Product Name', 'Department Name', 'Price', 'Stock']
            , colWidths: [5, 40, 40, 10, 15]
        });
        //prints out a new row for every item
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, `$${res[i].price}`, res[i].stock_quantity]);
        }
        //shows the table
        console.log(table.toString());
        menu(res.length);
    })
};

function purchase(itemID) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // console.log(res)
        inquirer.prompt([
            {
                name: "amount",
                message: "How many would you like? [Quit with Q]",
                type: "input",
                validate: function (value) {
                    if (value.toUpperCase() === "Q"){
                        return true;
                    }
                    else if (!isNaN(value) && parseInt(value) > 0) {
                        return true;
                    }
                    else {
                        console.log('\nThat is not a number, please enter a number')
                        return false;
                    }
                }
            }
        ]).then(function (response) {
            if(response.amount.toUpperCase() === "Q"){
                console.log("Thanks for coming by! Come again next time!")
                return connection.end()
            }
            //If the number is more than the stock
            if (parseInt(response.amount) > parseInt(res[parseInt(itemID -1)].stock_quantity)) {
                console.log('Insufficient Quantity!\nReturning to main menu......')
                //back to menu
                showCatalog();
            } else {
                //Then buy stuff, update the amount to subtract from the total stock

                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {//this happens cause indexes start at 0 and itemID is a string
                            stock_quantity: (res[parseInt(itemID - 1)].stock_quantity - parseInt(response.amount))
                        },
                        {
                            item_id: itemID
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`You bought ${response.amount} ${res[parseInt(itemID - 1)].product_name}, \nReturning to menu....`)
                        showCatalog();
                    })
                //back to menu
            }

            // else if the number is less than the stock, LET THEM BUY5
        });
    });
}