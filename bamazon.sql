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
	  ("Giant Bag of Trollis", "Food and Grocery", 6, 300),
	  ("Magnetic Mount","Automotive & Industrial", 8, 3),
	  ("Face Cleanser","Beauty and Health", 10, 40),
	  ("Stuffed Bear", "Toys", 20, 40),
	  ("Apple Tablet","Electronics", 200, 20),
	  ("Checkered-Red Sweater", "Clothing", 15, 50),
	  ("Soccer Ball","Sports and Outdoors", 15, 200),
	  ("Dog Leash", "Pet Supplies", 13, 35)


      