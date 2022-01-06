var mysql = require("mysql");
let Query = require("../constant");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    connection.query(Query.CREATE_IF_NOT_EXIST_DB, (error, db) => {
      if (db.warningCount == 1) {
        console.log(db.warningCount);
        console.log("DB is connected & exists");
      }
      connection.query(Query.CREATE_IF_NOT_EXIST_ADMIN_TABLE, (error, res) => {
        if (!error) {
          console.log("Admin created");
          connection.query(
            Query.CREATE_IF_NOT_EXIST_ATTENDANCE_TABLE,
            (error, res) => {
              if (!error) {
                console.log("Attendance created");
                let admin = {
                  name: "Murugan",
                  roll_number: "18st100",
                  password:
                    "$2b$10$fzU2buOImREC9Fmk23k6berxF9z./yBBhWXhkZeqh8Etn6V0yK1Ga",
                };
                connection.query(
                  Query.ADD_ADMIN,
                  admin,
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
          console.log("Admin table not able to create");
        }
      });
      connection.query(
        Query.CREATE_IF_NOT_EXIST_STUDENT_TABLE,
        (error, res) => {
          if (!error) {
            console.log("Student created");
          } else {
            console.log("Student table not able to create");
          }
        });
        connection.query(
          Query.CREATE_IF_NOT_EXIST_LAB_TABLE,
          (error, res) => {
            if (!error) {
              console.log("Lab created");
            } else {
              console.log("Lab table not able to create");
            }
          });
    });
  } else {
    console.log("Error while connecting with database");
  }
});
module.exports = connection;
