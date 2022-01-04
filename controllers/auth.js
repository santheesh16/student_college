const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/config.js");
const _ = require("lodash");
const expressJwt = require("express-jwt");
require("../constant");

const query = {
  //View or Select query
  SELECT_ROLLNUMBER_STUDENT: "SELECT * FROM students WHERE roll_number = ?;",
  SELECT_ROLLNUMBER_ATTENDANCE:
    "SELECT roll_number FROM attendances WHERE attendances.roll_number = ?;",

  //Insert or Create row query
  INSERT_STUDENT: "INSERT INTO students SET ? ;",
  INSERT_ATTENDANCE: "INSERT INTO attendances SET ? ;",
};

const academicYear = (batch) => {
  var begYear = parseInt(batch.substring(0, 4));
  var today = new Date();
  var curMonth = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var curYear = today.getFullYear();
  console.log(begYear);
  var studYear = curYear - begYear;

  var acadYear = curYear - 1;
  var acadSem = [];
  if (curMonth <= 6) {
    var semester;
    acadSem.push(acadYear + "-" + curYear);
    if (studYear == 1) {
      semester = 2;
    } else if (studYear == 2) {
      semester = 4;
    } else if (studYear == 3) {
      semester = 6;
    } else {
      semester = 8;
    }
    acadSem.push(semester);
  } else {
    var acadYear = curYear + 1;
    acadSem.push(curYear + "-" + acadYear);
    if (studYear == 0) {
      semester = 1;
    } else if (studYear == 1) {
      semester = 3;
    } else if (studYear == 2) {
      semester = 5;
    } else {
      semester = 7;
    }
    acadSem.push(semester);
  }
  return acadSem;
};

exports.signup = (req, res) => {
  var student = {
    name: req.body.name,
    roll_number: req.body.rollNumber,
    register_number: req.body.registerNumber,
    department: req.body.department,
    section: req.body.section,
    batch: req.body.batch,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  const rollNumber = req.body.rollNumber;
  connection.query(
    "SELECT * FROM students WHERE roll_number = ?;",
    rollNumber,
    function (error, user, fields) {
      console.log(user);
      if (user.length > 0) {
        return res.status(400).json({
          error: `${rollNumber} is already exist`,
        });
      } else {
        connection.query(
          "INSERT INTO students SET ? ;",
          student,
          function (error, user, fields) {
            if (error) {
              console.log("SIGNUP ERROR", error);
              return res.status(400).json({
                error: "Failed to Store",
              });
            } else {
              return res.json({
                message:
                  "Student Details Added successfully!Now Student Can Login",
              });
            }
          }
        );
      }
    }
  );
};

exports.signin = (req, res) => {
  const roll_number = req.body.roll_number;
  const password = req.body.password;
  connection.query(
    query.SELECT_ROLLNUMBER_STUDENT,
    [roll_number],
    (error, student, fields) => {
      if (error) {
        return res.status(400).json({
          error: "Some error occured",
        });
      } else {
        if (student.length > 0) {
          if (student[0].status == 0) {
            return res.status(400).json({
              error: "Please Contact Admin!! You not allowed login",
            });
          }
          const comparision = bcrypt.compareSync(password, student[0].password);
          if (comparision) {
            //Creating SubString
            student[0].logintime = new Date();
            const batch = student[0].batch;
            var acadSem = academicYear(batch);
            const login_attendance = {
              roll_number: student[0].roll_number,
              name: student[0].name,
              register_number: student[0].register_number,
              department: student[0].department,
              section: student[0].section,
              batch: student[0].batch,
              academic_year: acadSem[0],
              semester: acadSem[1],
              logintime: student[0].logintime,
            };

            connection.query(
              "INSERT INTO attendances SET ? ;",
              login_attendance,
              function (error, user, fields) {
                if (error) {
                  console.log("SIGNUP ERROR", error);
                  return res.status(400).json({
                    error: error,
                  });
                }
              }
            );
            const token = jwt.sign(
              { roll_number: student[0].roll_number },
              "secret_code_jwt",
              { expiresIn: "7d" }
            );

            return res.status(200).json({
              token,
              student,
              success: "Successfully Login",
            });
          } else {
            return res.status(400).json({
              error: "Roll number and password does not match",
            });
          }
        } else {
          connection.query(
            "SELECT * FROM admin WHERE admin.roll_number = ?;",
            [roll_number],
            (error, user, fields) => {
              console.log(roll_number);
              if (error) {
                return res.status(400).json({
                  error: "Some error occured",
                });
              } else {
                console.log(user.length);
                if (user.length > 0) {
                  const comparision = bcrypt.compareSync(
                    password,
                    user[0].password
                  );
                  if (comparision) {
                    const token = jwt.sign(
                      { id: user[0].id },
                      "secret_code_jwt",
                      { expiresIn: "7d" }
                    );
                    return res.status(200).json({
                      token,
                      user,
                      success: "Successfully Login",
                    });
                  } else {
                    return res.status(400).json({
                      error: "Roll number and password does not match",
                    });
                  }
                } else {
                  return res.status(400).json({
                    error: "Roll number does not exits",
                  });
                }
              }
            }
          );
        }
      }
    }
  );
};

exports.signout = (req, res) => {
  const userId = req.params.roll_number;
  connection.query(
    "SELECT * FROM attendances WHERE attendances.roll_number = ?;",
    userId,
    function (error, user, fields) {
      if (user[0].role === "student") {
        user[0].logouttime = new Date();
        const logouttime = user[0].logouttime;
        connection.query(
          "UPDATE attendances SET logouttime = ? WHERE roll_number = ? ;",
          [logouttime, userId],
          (error, user, fields) => {
            if (error) {
              console.log("SIGNOUT ERROR", error);
              return res.status(400).json({
                error: error,
              });
            }
            return res.json({
              success: true,
            });
          }
        );
      } else {
        return res.status(400).json({
          error: "User with that roll number does not exist. Please signup",
        });
      }
    }
  );
};

exports.requireSignin = expressJwt({
  secret: "secret_code_jwt",
  algorithms: ["HS256"],
});

exports.adminMiddleware = (req, res, next) => {
  connection.query(
    "SELECT * FROM admin WHERE id = ?;",
    req.user.id,
    (error, user, fields) => {
      if (error || user[0].id == 0) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (user[0].role !== "admin") {
        return res.status(400).json({
          error: "Admin resource. Access denied.",
        });
      }
      req.profile = user[0];
      next();
    }
  );
};
