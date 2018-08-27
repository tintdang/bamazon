DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
item_id INT(10) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(30),
department_name VARCHAR(30),
price INT(10),
stock_quantity INT(10),
PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Monster Hunter World", "Video Games", 60, 100),
	  ("Crazy Rich Asians", "Books", 30, 50),
	  ("Giant Bag of Trollis", "Food and Drink", 6, 300)


      