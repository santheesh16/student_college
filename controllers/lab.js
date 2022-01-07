const connection = require("../config/config.js");
require("dotenv").config();
let Query = require("../constant");



//viewStudentSection
exports.viewStudentAttendance = (req, res) => {
  let details = req.body.searchColumns;
  const labName = '%'+details.labName+'%';
  const dateWise = '%'+details.dateWise+'%';
  const studentBatch =  '%'+details.studentBatch+'%';
  const academicYear =  '%'+details.academicYear+'%';
  const semester =  '%'+details.semester+'%';
  const studentDept =  '%'+details.studentDept+'%';
  const section = '%'+details.section+'%';
  const studentName = '%'+details.studentName+'%';
  
  connection.query(
    Query.ATTENDANCE_DETAIL,
    [
      labName,
      dateWise,
      studentBatch,
      academicYear,
      semester,
      studentDept,
      section,
      studentName
    ],
    function (error, user, fields) {
      if (error) {
        console.log("GET ATTENDANCE", error)
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

exports.viewLabName = (req, res) => {
  const lab_department = req.body.labDepartment;
  console.log(lab_department)
  console.log(req.body);
  connection.query(
    Query.GET_LAB_NAME, lab_department,
    function (error, user, fields) {
      if (error) {
        console.log("GET LAB NAME", error)
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

exports.viewLabDetails = (req, res) => {
  connection.query(
    Query.GET_LABS_DETAILS,
    function (error, user, fields) {
      if (error) {
        console.log("GET LAB DETAILS",error)
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
    current_lab: req.body.currentLab
  }
  connection.query(
    Query.ADD_LAB_DETAILS, lab,
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
    Query.GET_LAB_DETAILS, [labId] ,
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
        Query.UPDATE_LAB_DETAILS,
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
    Query.DELETE_LAB,
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

