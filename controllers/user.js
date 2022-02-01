const connection = require("../config/config.js");
require("dotenv").config();
const bcrypt = require("bcrypt");
const excel = require("exceljs");
let Query = require("../constant");

//Student Profile Read
exports.read = (req, res) => {
  const userId = req.params.rollNumber;
  connection.query(
    Query.GET_STUDENT,
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
    Query.GET_STUDENT,
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
        Query.UPDATE_STUDENT,
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
/*
console.log(details)
  const roll_number = req.params.roll_number;
  const labName =  details.labName;
  const labDpt =  details.labDpt;
  const machineNo = details.machine_no; 
*/
exports.labUpdate = (req, res) => {
  let details = req.body.searchColumns;
  const roll_number = req.params.roll_number;
  console.log(details)
  
  const labName =  details.labName;
  const labDpt =  details.labDpt;
  const machineNo = details.machine_no; 
  
  connection.query(
    Query.GET_LAB_ID,
    [labName, labDpt],
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
            Query.UPDATE_ATTENDANCE,
            [user[0].lab_id, machineNo, roll_number],
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
    Query.GET_STUDENT,
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
    Query.ADMIN_ID,
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
    Query.ADMIN_ID,
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
              Query.UPDATE_ADMIN,
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
    Query.GET_STUDENT,
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
        Query.UPDATE_STUDENT,
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
    Query.GET_STUDENT_DEAULT_PASSWORD,
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
              Query.UPDATE_STUDENT_DEAULT_PASSWORD,
              [password],
              function (error, update, fields) {
                if (error) {
                  console.log("STUDENT UPDATED ERROR", error);
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
    Query.DELETE_STUDENT,
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
// Student Block
exports.studentBlock = (req, res) => {
  const roll_number = req.body.rollNumber;
  console.log(roll_number);
  connection.query(
    Query.UPDATE_BLOCK_STUDENT,
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
    Query.UPDATE_UNBLOCK_STUDENT,
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
    Query.GET_BLOCKED_STUDENT,
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
