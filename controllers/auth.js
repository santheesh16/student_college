const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/config.js");
const _ = require("lodash");
const expressJwt = require("express-jwt");
let Query = require("../constant");
const nodemailer = require('nodemailer')

const academicYear = (batch) => {
  var begYear = parseInt(batch.substring(0, 4));
  var today = new Date();
  var curMonth = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var curYear = today.getFullYear();
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

exports.signup = (req, res, done) => {
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
    Query.STUDENT_ROLLNUMBER,
    rollNumber,
    function (error, user, fields) {
      if (user.length > 0) {
        return res.status(400).json({
          error: `${rollNumber} is already exist`,
        });
      } else {
        connection.query(
          Query.ADD_STUDENT,
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
    Query.STUDENT_ROLLNUMBER,
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
          console.log(password, student[0].password)
          const comparision = bcrypt.compareSync(password, student[0].password);
          console.log(password, student[0].password, comparision)
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
              Query.ADD_ATTENDANCE,
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
              error: "Employee ID and password does not match",
            });
          }
        } else {
          connection.query(
            Query.ADMIN_ROLLNUMBER,
            [roll_number],
            (error, user, fields) => {
              if (error) {
                console.log("ADMIN LOGIN", error);
                return res.status(400).json({
                  error: "Some error occured",
                });
              } else {
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
                      error: "Employee ID and password does not match",
                    });
                  }
                } else {
                  return res.status(400).json({
                    error: "Employee ID does not exits",
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
    Query.ATTENDANCE_ROLLNUMBER,
    userId,
    function (error, user, fields) {
      if (user[0].role === "student") {
        user[0].logouttime = new Date();
        const logouttime = user[0].logouttime;
        connection.query(
          Query.UPDATE_STUD_LOGOUT,
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
          error: "User with that Employee ID does not exist. Please signup",
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
    Query.ADMIN_ROLLNUMBER,
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


exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;

  const email_to = email;
  const rollNumberEmail = email_to.split("@");

  console.log(rollNumberEmail)
  if (rollNumberEmail[1] !== "kpriet.ac.in") {
    return res.status(400).json({
      error: 'Please Enter Your Official College Mail Id',
    });
  }
  const rollNumber = rollNumberEmail[0];
  connection.query(
    Query.STUDENT_ROLLNUMBER,
    rollNumber,
    function (error, user, fields) {
      if (user[0].roll_number === 0 || error) {
        console.log(error, user)
        return res.status(400).json({
          error: `${user.roll_number} does not exist`,
        });
      }
      const secret = process.env.JWT_SECRET + user.password;
      console.log(user[0].roll_number)
      console.log(user[0])
      const payload = {
        email: `${email_to}`,
        rollNumber: `${user[0].roll_number}`,

      }
      const token = jwt.sign(payload, secret, { expiresIn: '15m' })
      const link = `${process.env.CLIENT_URL}/reset-password/${user[0].roll_number}/${token}`
      const output =
        `<h3>Private Limited Company</h3>
          <p>Click the link <a href=${link}>${link}</a> to reset your password</p>`;

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_FROM,
        service: 'gmail', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_FROM, // generated ethereal user
          pass: 'flabvpyuxqjfrpcg', // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false
        }
      });
      console.log(email_to)

      let mailOptions = {
        from: `"KPRiET " <${process.env.EMAIL_FROM}>`,
        to: `${email_to}`,
        subject: "Reset Password ✔", // Subject line
        text: output, // plain text body
        html: output, // html body
      };
      transporter.sendMail(mailOptions, (error, info) => {

        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      });
      console.log(link);
      res.send('Password reset link has been sent to ur email')
    }
  );
}


exports.resetPassword = (req, res, next) => {
  const { rollNumber, token } = req.params;
  const { newPassword } = req.body
  console.log(rollNumber, token, newPassword)
  connection.query(
    Query.STUDENT_ROLLNUMBER,
    rollNumber,
    function (error, user, fields) {
      if (user[0].roll_number === 0 || error) {
        console.log(error, user)
        return res.status(400).json({
          error: `${user[0].roll_number} does not exist`,
        });
      }
      const comparision = bcrypt.compareSync(newPassword, user[0].password);
      if (comparision) {
        return res.status(400).json({
          error: 'New password should be different from old password',
        });
      } else {
        connection.query(
          Query.UPDATE_STUDENT_PASSWORD,
          [bcrypt.hashSync(newPassword, 10), rollNumber],
          function (error, user, fields) {
            if (error) {
              console.log(error)
              return res.status(400).json({
                error: 'Password unable to update',
              });
            }
            return res.status(200).json({
              message: 'Password successfully updated',
            });

          }
        );
      }

    }
  );
}