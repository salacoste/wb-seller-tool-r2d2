CREATE DATABASE wb_tools_r2d2;
USE wb_tools_r2d2;

CREATE TABLE testTools (
   id INT(11) NOT NULL AUTO_INCREMENT,
   name VARCHAR(255) NOT NULL,
   description VARCHAR(255) NOT NULL,
   PRIMARY KEY (id)
);

INSERT INTO testTools (name, description) VALUES
   ('Tool 1', 'This is the first test tool'),
   ('Tool 2', 'This is the second test tool'),
   ('Tool 3', 'This is the third test tool');