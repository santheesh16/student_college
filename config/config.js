var mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

const connection = mysql.createConnection({
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  connectionLimit: 10,
});

var del = connection._protocol._delegateError;
connection._protocol._delegateError = function (err, sequence) {
  if (err.fatal) {
    console.trace("fatal error: " + err.message);
  }
  return del.call(this, err, sequence);
};

connection.connect(function (err) {
  if (!err) {
    connection.query("CREATE DATABASE IF NOT EXISTS student_details;", (error, db) => {
      if (db.warningCount == 1) {
        console.log(db.warningCount);
        console.log("DB is connected & exists");
      } else {
        connection.query(
          "CREATE TABLE IF NOT EXISTS student_details.admin (id int NOT NULL AUTO_INCREMENT, role varchar(10) NOT NULL DEFAULT 'admin', name varchar(45) NOT NULL, roll_number varchar(45) NOT NULL,password varchar(100) NOT NULL,PRIMARY KEY (id));",
          (error, res) => {
            if (!error) {
              console.log("Admin created");
              connection.query(
                "CREATE TABLE IF NOT EXISTS student_details.students ( id int NOT NULL AUTO_INCREMENT, role varchar(10) DEFAULT 'student', roll_number varchar(50) DEFAULT NULL, register_number bigint DEFAULT NULL, name varchar(100) DEFAULT NULL, department varchar(40) DEFAULT NULL, section varchar(1) DEFAULT NULL, batch varchar(10) DEFAULT NULL, password varchar(200) DEFAULT NULL, createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, status tinyint DEFAULT '1', PRIMARY KEY (`id`)); ",
                (error, res) => {
                  if (!error) {
                    console.log("Student created");
                    connection.query(
                      "CREATE TABLE IF NOT EXISTS student_details.lab_details (lab_id int NOT NULL AUTO_INCREMENT, lab_name varchar(50) NOT NULL, lab_department varchar(50) NOT NULL, PRIMARY KEY (lab_id)) ;",
                      (error, res) => {
                        if (!error) {
                          console.log("Lab created");
                          connection.query(
                            "CREATE TABLE IF NOT EXISTS student_details.attendances (id int NOT NULL AUTO_INCREMENT, role varchar(45) DEFAULT 'student', roll_number varchar(50) NOT NULL, register_number bigint NOT NULL, name varchar(30) NOT NULL, department varchar(20) NOT NULL, section varchar(1) DEFAULT NULL, batch varchar(10) DEFAULT NULL, academic_year varchar(10) DEFAULT NULL, semester int DEFAULT NULL, logintime datetime DEFAULT NULL, logouttime datetime DEFAULT NULL, lab_id int DEFAULT NULL, machine_no int DEFAULT NULL, createdAt datetime DEFAULT CURRENT_TIMESTAMP, updatedAt datetime DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), KEY FK_lab_id_idx (lab_id), CONSTRAINT FK_lab_id FOREIGN KEY (lab_id) REFERENCES lab_details (lab_id)); ",
                            (error, res) => {
                              if (!error) {
                                console.log("Attendance created")
                                let admin = {
                                  name: "Murugan",
                                  roll_number: "18st100",
                                  password: "$2b$10$fzU2buOImREC9Fmk23k6berxF9z./yBBhWXhkZeqh8Etn6V0yK1Ga"
                                }
                                connection.query(
                                  "INSERT INTO student_details.admin SET ?;", admin,
                                  (error, res) => {
                                    if (!error) {
                                      console.log("Admin inserted");
                                      console.log(res);
                                    } else {
                                      console.log("Admin not inserted");
                                    }
                                  }
                                );
                              } else {
                                console.log("Attendance table not able to create");
                              }
                            }
                          );
                        } else {
                          console.log("Lab table not able to create");
                        }
                      }
                    );
                  } else {
                    console.log("Student table not able to create");
                  }
                }
              );
            } else {
              console.log("Admin table not able to create");
            }
          }
        );
      }
    });
  } else {
    console.log("Error while connecting with database");
  }
});
module.exports = connection;
