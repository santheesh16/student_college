const connection = require("../config/config.js");
require("dotenv").config();
const bcrypt = require("bcrypt");
const excel = require("exceljs");

//Student Profile Read
exports.read = (req, res) => {
  const userId = req.params.rollNumber;
  connection.query(
    "SELECT * FROM student WHERE roll_number = ?;",
    userId,
    function (error, user, fields) {
      if (error || user.length === 0) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      user[0].password = undefined;
      res.json(user[0]);
    }
  );
};

//Student Profile Update
exports.update = (req, res) => {
  //console.log('UPDATE USER - req.user', req.user, 'UDATE DATA', req.body)
  const {
    rollNumber,
    registerNumber,
    department,
    section,
    batch,
    name,
    password,
  } = req.body;
  const studRollNumber = req.user.rollNumber;
  connection.query(
    "SELECT * FROM student WHERE roll_number = ?;",
    studRollNumber,
    function (error, user, fields) {
      if (error || user[0].id === 0) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (!name) {
        return res.status(400).json({
          error: "Name is required",
        });
      } else {
        user[0].name = name;
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: "Password should be min 6 character long",
          });
        } else {
          user[0].password = bcrypt.hashSync(password, 10);
        }
      }
      user[0].roll_number = rollNumber;
      user[0].register_number = registerNumber;
      user[0].department = department;
      user[0].section = section;
      user[0].batch = batch;

      connection.query(
        "UPDATE student SET ? WHERE roll_number = ? ;",
        [user[0], studRollNumber],
        function (error, user, fields) {
          if (error) {
            console.log("USER UPDATED ERROR", error);
            return res.status(400).json({
              error: "User update failed",
            });
          }
        }
      );
      user[0].password = undefined;
      res.json(user[0]);
    }
  );
};

exports.labUpdate = (req, res) => {
  const roll_number = req.params.roll_number;
  const { lab_name, lab_department, machine_no } = req.body;
  connection.query(
    "SELECT lab_id FROM lab_details WHERE  lab_name = ? AND lab_department = ?;",
    [lab_name, lab_department],
    function (error, user, fields) {
      console.log(user);
      if (error) {
        console.log("USER UPDATED ERROR", error);
        return res.status(400).json({
          error: "User update failed",
        });
      } else {
        if (user.length > 0) {
          connection.query(
            "UPDATE attendances SET lab_id = ? , machine_no = ? WHERE roll_number = ? ;",
            [user[0].lab_id, machine_no, roll_number],
            function (error, update, fields) {
              if (error) {
                console.log("LAB UPDATED ERROR", error);
                return res.status(400).json({
                  error: "Lab update failed",
                });
              } else {
                return res.status(200).json({
                  success: "Successfully Lab Updated",
                });
              }
            }
          );
        } else {
          return res.status(400).json({
            error: "Laboratory and Department is not Exists",
          });
        }
      }
    }
  );
};

//Admin Student Read
exports.adminStudentRead = (req, res) => {
  const studentRoll = req.params.rollNumber;
  connection.query(
    "SELECT * FROM students WHERE students.roll_number = ?;",
    studentRoll,
    function (error, user, fields) {
      if (error || !user[0]) {
        return res.status(400).json({
          error: "Roll Number not found",
        });
      }
      res.json(user[0]);
    }
  );
};

exports.adminRead = (req, res) => {
  const userId = req.params.id;
  connection.query(
    "SELECT * FROM admin WHERE id = ?;",
    userId,
    function (error, user, fields) {
      if (error || !user[0]) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      user[0].password = undefined;
      res.json(user[0]);
    }
  );
};

exports.adminUpdate = (req, res) => {
  //console.log('UPDATE USER - req.user', req.user, 'UDATE DATA', req.body)
  const { oldPassword, newPassword } = req.body;
  const id = req.user.id;
  connection.query(
    "SELECT * FROM admin WHERE admin.id = ?;",
    id,
    function (error, user, fields) {
      if (error || user[0].id === 0) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (oldPassword && newPassword) {
        if (newPassword.length < 6) {
          return res.status(400).json({
            error: "Password should be min 6 character long",
          });
        } else {
          const comparision = bcrypt.compareSync(oldPassword, user[0].password);
          console.log(user[0].password);
          if (comparision) {
            const password = bcrypt.hashSync(newPassword, 10);
            connection.query(
              "UPDATE admin SET password = ? WHERE id = ? ;",
              [password, id],
              function (error, update, fields) {
                if (error) {
                  console.log("USER UPDATED ERROR", error);
                  return res.status(400).json({
                    error: "User update failed",
                  });
                } else {
                  console.log(user[0]);
                  user[0].password = undefined;
                  return res.json(user[0]);
                }
              }
            );
          } else {
            return res.status(400).json({
              error: "Old Password doesn't match",
            });
          }
        }
      } else {
        return res.status(400).json({
          error: "Please!! Enter Old and New Password to Update",
        });
      }
    }
  );
};

//Update Student details by Admin
exports.adminStudentUpdate = (req, res) => {
  //console.log('UPDATE USER - req.user', req.user, 'UDATE DATA', req.body)
  const { register_number, department, section, batch, name, password } =
    req.body;
  const studrollNumber = req.params.rollNumber;
  connection.query(
    "SELECT * FROM students WHERE roll_number = ?;",
    studrollNumber,
    function (error, user, fields) {
      if (error || !user[0]) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (!name) {
        return res.status(400).json({
          error: "Name is required",
        });
      } else {
        user[0].name = name;
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: "Password should be min 6 character long",
          });
        } else {
          user[0].password = bcrypt.hashSync(password, 10);
        }
      }
      user[0].roll_number = studrollNumber;
      user[0].register_number = register_number;
      user[0].department = department;
      user[0].section = section;
      user[0].batch = batch;
      connection.query(
        "UPDATE students SET ? WHERE roll_number = ? ;",
        [user[0], studrollNumber],
        function (error, user, fields) {
          if (error) {
            console.log("USER UPDATED ERROR", error);
            return res.status(400).json({
              error: "User update failed",
            });
          }
        }
      );
      user[0].password = undefined;
      res.json(user[0]);
    }
  );
};

//Update Student details by Admin
exports.studentPasswordUpdate = (req, res) => {
  const { oldStudentPassword, newStudentPassword } = req.body;
  console.log(oldStudentPassword);
  console.log(newStudentPassword);
  connection.query(
    "Select default (password) as defaultPass from students;",
    function (error, user, fields) {
      if (error || user.length == 0) {
        return res.status(400).json({
          error: "Unable to Change the Password!!",
        });
      }
      if (oldStudentPassword && newStudentPassword) {
        if (newStudentPassword.length < 6) {
          return res.status(400).json({
            error: "Password should be min 6 character long",
          });
        } else {
          const comparision = bcrypt.compareSync( oldStudentPassword, user[0].defaultPass);
          if (comparision) {
            const password = bcrypt.hashSync(newStudentPassword, 10);
            connection.query(
              "ALTER TABLE students ALTER password SET DEFAULT ?;",
              [password],
              function (error, update, fields) {
                if (error) {
                  console.log("USER UPDATED ERROR", error);
                  return res.status(400).json({
                    error: "User update failed",
                  });
                } else {
                  console.log(user[0]);
                  user[0].password = undefined;
                  return res.json(user[0]);
                }
              }
            );
          } else {
            return res.status(400).json({
              error: "Old Password doesn't match",
            });
          }
        }
      } else {
        return res.status(400).json({
          error: "Please!! Enter Old and New Password to Update",
        });
      }
    }
  );
};

exports.adminStduntDelete = (req, res) => {
  //console.log('UPDATE USER - req.user', req.user, 'UDATE DATA', req.body)
  const studentId = req.params.id;
  connection.query(
    "DELETE FROM student WHERE id = ?;",
    studentId,
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      res.json({
        message: "Deleted Successfully",
      });
    }
  );
};

exports.excelFile = (req, res) => {
  const { lab_name, lab_department } = req.body;
  connection.query(
    "SELECT id, roll_number, register_number, name, department, lab_name, lab_department, logintime, logouttime, machine_no FROM login_attendance AS la INNER JOIN lab_details AS ld ON  la.lab_id = ld.lab_id WHERE ld.lab_name = ? AND ld.lab_department = ?;",
    [lab_name, lab_department],
    function (error, user, fields) {
      const labAttendance = JSON.parse(JSON.stringify(user));
      console.log(labAttendance);

      let workbook = new excel.Workbook(); //creating workbook
      let worksheet = workbook.addWorksheet("Lab Attendance"); //creating worksheet

      //  WorkSheet Header
      worksheet.columns = [
        { header: "Id", key: "id", width: 5 },
        { header: "Roll No", key: "roll_number", width: 15 },
        { header: "Register No", key: "register_number", width: 15 },
        { header: "Name", key: "name", width: 15 },
        { header: "Department", key: "department", width: 10 },
        { header: "Lab Name", key: "lab_name", width: 15 },
        { header: "Lab Deparment", key: "lab_department", width: 10 },
        { header: "Login Time", key: "logintime", width: 20 },
        { header: "Logout Time", key: "logouttime", width: 20 },
        { header: "Machine no", key: "machine_no", width: 5, outlineLevel: 1 },
      ];
      //  , outlineLevel: 1
      // Add Array Rows
      worksheet.addRows(labAttendance);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename = " + "Lab Attendance.xlsx"
      );

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    }
  );
};

// Student Block
exports.studentBlock = (req, res) => {
  const roll_number = req.body.rollNumber;
  console.log(roll_number);
  connection.query(
    "UPDATE students SET students.status = 0 WHERE students.roll_number = ?;",
    [roll_number],
    function (error, user, fields) {
      if (error) {
        console.log("SIGNIN ERROR", error);
        return res.status(400).json({
          error: "Failed to block",
        });
      }
      return res.json({
        message: "Blocked Successfully",
      });
    }
  );
};

// Student Unblock
exports.studentUnBlock = (req, res) => {
  const roll_number = req.body.rollNumber;
  console.log(roll_number);
  connection.query(
    "UPDATE students SET students.status = 1 WHERE students.roll_number = ?;",
    [roll_number],
    function (error, user, fields) {
      if (error) {
        console.log("SIGNIN ERROR", error);
        return res.status(400).json({
          error: "Failed to Unblock",
        });
      }
      return res.json({
        message: "Unblocked Successfully",
      });
    }
  );
};

exports.blockList = (req, res) => {
  connection.query(
    "SELECT students.roll_number FROM students WHERE students.status = 0;",
    function (error, user, fields) {
      if (error || !user) {
        return res.status(400).json({
          error: "Roll Number not found",
        });
      }
      res.json(user);
    }
  );
};
