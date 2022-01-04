const connection = require("../config/config.js");
require("dotenv").config();



exports.viewAttendanceDetails = (req, res) => {
  const labName = req.params.labName;
  console.log(labName);
  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? ; ",
    labName,
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        res.json(user);
      }
    }
  );

  exports.viewShowDetails = (req, res) => {
    const { labName } = req.body;
    console.log(labName);
    if (labName !== "") {
      connection.query(
        "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? ; ",
        labName,
        function (error, user, fields) {
          if (error) {
            return res.status(400).json({
              error: "Failed to get Student details",
            });
          }
          if (user.length == 0) {
            return res.status(400).json({
              error: "No data Found",
            });
          } else {
            console.log(user);
            return res.json(user);
          }
        }
      );
    }
  };
};

exports.viewLabDate = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;

  if (labName !== " ") {
    connection.query(
      "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ?; ",
      [labName, dateWise],
      function (error, user, fields) {
        if (error) {
          return res.status(400).json({
            error: "Failed to get Student details",
          });
        }
        if (user.length == 0) {
          return res.status(400).json({
            error: "No data Found",
          });
        } else {
          res.json(user);
        }
      }
    );
  }
};

exports.viewLabBatchAttendance = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ?",
    [labName, dateWise, studentBatch],
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        return res.json(user);
      }
    }
  );
};

exports.viewLabBatchYear = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ?",
    [labName, dateWise, studentBatch, academicYear],
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        return res.json(user);
      }
    }
  );
};

//viewLabBatchYearSection
exports.viewLabBatchYearSection = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ?",
    [labName, dateWise, studentBatch, academicYear, semester],
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        return res.json(user);
      }
    }
  );
};

//viewStudentDept

exports.viewStudentDept = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;
  const studentDept = req.params.studentDept;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ? AND att.department = ?",    [labName, dateWise, studentBatch, academicYear, semester, studentDept],
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        return res.json(user);
      }
    }
  );
};

//viewStudentSection

exports.viewStudentSection = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;
  const studentDept = req.params.studentDept;
  const section = req.params.section;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ? AND att.department = ? AND section = ? ",
    [
      labName,
      dateWise,
      studentBatch,
      academicYear,
      semester,
      studentDept,
      section,
    ],
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        return res.json(user);
      }
    }
  );
};


exports.viewLabDetails = (req, res) => {
  connection.query(
    "SELECT * FROM lab_details",
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      }
      if (user.length == 0) {
        return res.status(400).json({
          error: "No data Found",
        });
      } else {
        return res.json(user);
      }
    }
  );
}

exports.addLab = (req, res) => {

  var lab = {
    lab_id: req.body.labId,
    lab_name: req.body.labName,
    lab_department: req.body.labDept,
    current_lab: 0
  }
  connection.query(
    "INSERT INTO student_details.lab_details SET ?;", lab,
    (error, user) => {
      if (!error) {
        return res.json({
          message:
            "Lab Details Added successfully!",
        });
      } else {
        console.log("LABADD ERROR", error);
        return res.status(400).json({
          error: "Please enter lab details carefully!!",
        });
      }
    }
  );
}

exports.updateLab = (req, res) => {
  const { labId, labName, labDept, currentLab} = req.body;
  connection.query(
    "SELECT * FROM lab_details WHERE lab_id = ?;", [labId] ,
    function (error, user, fields) {
      if (error || !user[0]) {
        return res.status(400).json({
          error: "Lab not found",
        });
      }
      user[0].lab_name = labName;
      user[0].lab_department = labDept;
      user[0].current_lab = currentLab;
      connection.query(
        "UPDATE lab_details SET ? WHERE lab_id = ? ;",
        [user[0], labId],
        function (error, user, fields) {
          if (error) {
            console.log("LAB UPDATED ERROR", error);
            return res.status(400).json({
              error: "Lab update failed",
            });
          }
        }
      );
      res.json(user[0]);
    }
    )
}

exports.deleteLab = (req, res) => {
  const labId = req.params.lab_id;
  connection.query(
    "DELETE FROM lab_details WHERE lab_id = ?;",
    labId,
    function (error, user, fields) {
      if (error) {
        return res.status(400).json({
          error: "Lab not found",
        });
      }
      res.json({
        message: "Deleted Successfully",
      });
    }
  );
}

