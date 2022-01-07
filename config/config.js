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
        console.log("DB is connected ");
      }
      connection.query(Query.CREATE_IF_NOT_EXIST_ADMIN_TABLE, (error, res) => {
        if (!error && res.warningCount == 1) {
          console.log("Admin Table exists");
          const defalutAdmin = "18st100";
          connection.query(
            Query.GET_DEFAULT_ADMIN,
            defalutAdmin,
            (error, res) => {
              if (res.length === 0) {
                let admin = {
                  name: "Murugan",
                  roll_number: defalutAdmin,
                  password:
                    "$2b$10$fzU2buOImREC9Fmk23k6berxF9z./yBBhWXhkZeqh8Etn6V0yK1Ga",
                };
                connection.query(Query.ADD_ADMIN, admin, (error, res) => {
                  if (!error) {
                    console.log("Admin inserted");
                  } else {
                    console.log("Admin not inserted");
                  }
                });
              } else {
                console.log("Admin already exist");
              }
            });
        } else {
          console.log("Admin Table created", res);
          const defalutAdmin = "18st100";
          connection.query(
            Query.GET_DEFAULT_ADMIN,
            defalutAdmin,
            (error, res) => {
              if (res.length === 0) {
                let admin = {
                  name: "Murugan",
                  roll_number: defalutAdmin,
                  password:
                    "$2b$10$fzU2buOImREC9Fmk23k6berxF9z./yBBhWXhkZeqh8Etn6V0yK1Ga",
                };
                connection.query(Query.ADD_ADMIN, admin, (error, res) => {
                  if (!error) {
                    console.log("Admin inserted");
                  } else {
                    console.log("Admin not inserted");
                  }
                });
              } else {
                console.log("Admin already exist");
              }
            });
        }
      });
      connection.query(
        Query.CREATE_IF_NOT_EXIST_ATTENDANCE_TABLE,
        (error, res) => {
          if (!error && res.warningCount == 1) {
            console.log("Attendance Table exists");
          } else {
            console.log("Attendance Table Created", res);
          }
        }
      );
      connection.query(
        Query.CREATE_IF_NOT_EXIST_STUDENT_TABLE,
        (error, res) => {
          if (!error && res.warningCount == 1) {
            console.log("Student Table exists");
          } else {
            console.log("Student Table created", res);
          }
        }
      );
      connection.query(Query.CREATE_IF_NOT_EXIST_LAB_TABLE, (error, res) => {
        if (!error && res.warningCount == 1) {
          console.log("Lab Table exists");
        } else {
          console.log("Lab Table created", res);
        }
      });
    });
  } else {
    console.log("Error while connecting with database");
  }
});
module.exports = connection;
