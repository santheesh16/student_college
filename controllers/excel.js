const bcrypt = require("bcrypt");
const connection = require("../config/config.js");

const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const template = fs.readFileSync(
  path.resolve(__dirname, "../template.html"),
  "utf-8"
);

exports.checkUploadFile = (req, res) => {
  if (req.file == undefined) {
    return res.status(400).json({
      message: "Please upload an excel file!",
    });
  }
  let path =
    __basedir +
    "/studentcollege/resourses/static/assets/uploads/" +
    req.file.filename;
  let breakCondition = false;
  readXlsxFile(path).then((rows) => {
    // skip header
    rows.shift();
    var students = [];

    rows.forEach((row) => {
      let student = {
        roll_number: row[1],
        register_number: row[2],
        name: row[3],
        department: row[4],
        password: bcrypt.hashSync(row[5], 10),
      };
      students.push(student);
    });
    var i;
    for (i = 0; i < students.length; i++) {
      connection.query(
        "SELECT COUNT(*) as count FROM students WHERE students.roll_number = ?;",
        students[i].roll_number,
        function (error, user, fields) {
          console.log(user[0].count);
          if (user[0].count == 0 && !breakCondition) {
            connection.query(
              "INSERT INTO students SET ?;",
              students[i],
              function (error, student, fields) {
                if (error && !breakCondition) {
                  console.log("SIGNUP ERROR", error);
                  breakCondition = true;
                  return res.status(400).json({
                    error: "Failed to Store Students data",
                  });
                } else if (i == students.length - 1) {
                  console.log(i, students.length - 1);
                  return res.json({
                    message:
                      "Student details Successfully Added!! Now student can login",
                  });
                }
              }
            );
          } else if (!breakCondition) {
            breakCondition = true;
            console.log(breakCondition);
            return res.status(400).json({
              error: "Roll Number is already exist!! Please Check the file",
            });
          }
        }
      );
    }
  });
};

exports.upload = (req, res) => {
  if (req.file == undefined) {
    return res.status(400).json({
      message: "Please upload an excel file!",
    });
  }
  let path =
    __basedir +
    "/studentcollege/resourses/static/assets/uploads/" +
    req.file.filename;
  readXlsxFile(path).then((rows) => {
    // skip headerdd
    rows.shift();
    var students = [];
    rollNumber = [];
    console.log(rows);
    rows.forEach((row) => {
      let student = {
        roll_number: row[1],
        register_number: row[2],
        name: row[3],
        department: row[4],
        section: row[5],
        batch: row[6],
      };
      students.push(student);
    });
    var i;
    for (i = 0; i < students.length; i++) {
      connection.query(
        "INSERT INTO students SET ?;",
        students[i],
        function (error, user, fields) {
          if (error) {
            console.log("SIGNUP ERROR", error);
            return res.status(400).json({
              error: "Failed to store the students ",
            });
          }
        }
      );
    }
    return res.json({
      message: "Students details successfully added",
    });
  });
};

exports.uploadUpdate = (req, res) => {
  if (req.file == undefined) {
    return res.status(400).json({
      message: "Please upload an excel file!",
    });
  }
  let path =
    __basedir +
    "/studentcollege/resourses/static/assets/uploads/" +
    req.file.filename;
  readXlsxFile(path).then((rows) => {
    // skip header
    rows.shift();
    rollNumber = [];
    rows.forEach((row) => {
      let student = {
        roll_number: row[1],
        register_number: row[2],
        name: row[3],
        department: row[4],
        section: row[5],
        batch: row[6],
        password: bcrypt.hashSync(row[7], 10),
      };
      connection.query(
        "UPDATE students SET students.roll_number = ?, students.register_number = ?, students.name = ?, students.department = ?, students.section = ?, students.batch = ?, students.password = ? WHERE roll_number = ?",
        [
          student.roll_number,
          student.register_number,
          student.name,
          student.department,
          student.section,
          student.batch,
          student.password,
          student.roll_number,
        ],
        function (error, user, fields) {
          if (error) {
            console.log("SIGNUP ERROR", error);
            return res.status(400).json({
              error: "Failed to store the students ",
            });
          }
        }
      );
    });
    return res.json({
      message: "Students details successfully upated",
    });
  });
};


exports.getStudents = (req, res) => {
  Student.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        error: "Some error occurred while retrieving students.",
      });
    });
};

exports.download = (req, res) => {
  Student.findAll().then((objs) => {
    let students = [];

    objs.forEach((obj) => {
      students.push({
        id: obj.id,
        roll_number: obj.roll_number,
        register_number: obj.register_number,
        name: obj.name,
        department: obj.department,
        password: obj.password,
      });
    });
    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Students");

    worksheet.columns = [
      { header: "Id", key: "id", width: 5 },
      { header: "Roll Number", key: "roll_number", width: 10 },
      { header: "Register Number", key: "register_number", width: 20 },
      { header: "Name", key: "name", width: 15 },
      { header: "Department", key: "department", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(students);

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
  });
};


exports.attendanceExcel = (req, res) => {
  const students = req.params.details;
  console.log(students)
  let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Lab Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

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

exports.excelLabName = (req, res) => {
  const labName = req.params.labName;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? ; ",
    labName,
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
};

exports.excelDateWise = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ?; ",
    [labName,dateWise],
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
}


exports.excelBatch = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ?",
    [labName,dateWise, studentBatch],
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
}

exports.excelAcademic = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? ",
    [labName, dateWise, studentBatch, academicYear],
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
}

exports.excelSemester = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ?",
    [labName, dateWise, studentBatch, academicYear, semester],
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
}

exports.excelStudDept = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;
  const studentDept = req.params.studentDept;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ? AND att.department = ?",
    [labName, dateWise, studentBatch, academicYear, semester, studentDept],
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
}

exports.excelStudSection = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;
  const studentDept = req.params.studentDept;
  const section = req.params.section;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ? AND att.department = ? AND section = ? ",
    [labName, dateWise, studentBatch, academicYear, semester, studentDept, section],
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename = " + "Attendance.xlsx"
        );
        
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
      }
    }
  );
}

exports.attendanceDatewise = (req, res) => {
  const logintime = req.params.datewise;
  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, DATE_FORMAT(att.logintime,'%d-%m-%Y') date, DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND DATE(att.logintime ) = ?; ",
    logintime,
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            date: student.date,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Lab Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

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
    }
  );
};

exports.attendanceStudentWise = (req, res) => {
  const department = req.params.studentWise;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, DATE_FORMAT(att.logintime,'%d-%m-%Y') date, DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  att.department = ?; ",
    department,
    function (error, students, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student details",
        });
      } else {
        let attendance = [];
        students.forEach((student) => {
          attendance.push({
            id: student.id,
            roll_number: student.roll_number,
            register_number: student.register_number,
            name: student.name,
            department: student.department,
            date: student.date,
            lab_name: student.lab_name,
            lab_department: student.lab_department,
            logintime: student.logintime,
            logouttime: student.logouttime,
            machine_no: student.machine_no,
          });
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Lab Attendance");

        worksheet.columns = [
          { header: "S.No", key: "id", width: 5 },
          { header: "Roll No", key: "roll_number", width: 15 },
          { header: "Register No", key: "register_number", width: 15 },
          { header: "Name", key: "name", width: 15 },
          { header: "Department", key: "department", width: 10 },
          { header: "Lab Name", key: "lab_name", width: 15 },
          { header: "Lab Department", key: "lab_department", width: 15 },
          { header: "Date", key: "date", width: 15 },
          { header: "Login Time", key: "logintime", width: 20 },
          { header: "Logout Time", key: "logouttime", width: 20 },
          {
            header: "Machine no",
            key: "machine_no",
            width: 5,
            outlineLevel: 1,
          },
        ];

        // Add Array Rows
        worksheet.addRows(attendance);

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
    }
  );
};

exports.downloadPdf = (req, res) => {
  setTimeout(() => {
    var data = fs.readFileSync(
      path.resolve(__dirname, "../pdfs/attendance.pdf")
    );
    res.contentType("application/pdf");
    res.send(data);
  }, 2000);
};

exports.pdfLabName = (req, res) => {
  const labName = req.params.labName;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.lab_id, DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ?; ",
    labName,
    function (error, details, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      }

      const options = {
        format: "A4",
        orientation: "portrait",
      };
      const detail = details;
      const document = {
        html: template,
        data: {
          detail,
        },
        path: "./pdfs/attendance.pdf",
      };

      
      if (detail.length > 0) {
        pdf.create(document, options);
        res.send(Promise.resolve());
      } else {
        return res.status(400).json({
          error: "No data Found!! Pdf Not Created",
        });
      }
    }
  );
};

exports.pdfDateWise = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ?; ",
    [labName, dateWise],
    function (error, detail, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      } else {
        const options = {
          format: "A4",
          orientation: "portrait",
        };
        const document = {
          html: template,
          data: {
            detail,
          },
          path: "./pdfs/attendance.pdf",
        };

        if (detail.length > 0) {
          pdf.create(document, options);
          res.send(Promise.resolve());
        } else {
          return res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          });
        }
      }
    }
  );
};

exports.pdfBatch = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ?",
    [labName,dateWise, studentBatch],
    function (error, details, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      } else {
        const options = {
          format: "A4",
          orientation: "portrait",
        };
        const detail = details;
        const document = {
          html: template,
          data: {
            detail,
          },
          path: "./pdfs/attendance.pdf",
        };

        if (detail.length > 0) {
          pdf.create(document, options);
          res.send(Promise.resolve());
        } else {
          return res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          });
        }
      }
    }
  );
};


exports.pdfAcademic = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? ",
    [labName, dateWise, studentBatch, academicYear],
    function (error, details, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      } else {
        const options = {
          format: "A4",
          orientation: "portrait",
        };
        const detail = details;
        const document = {
          html: template,
          data: {
            detail,
          },
          path: "./pdfs/attendance.pdf",
        };

        if (detail.length > 0) {
          pdf.create(document, options);
          res.send(Promise.resolve());
        } else {
          return res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          });
        }
      }
    }
  );
};


exports.pdfSemester = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ?",
    [labName, dateWise, studentBatch, academicYear, semester],
    function (error, details, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      } else {
        const options = {
          format: "A4",
          orientation: "portrait",
        };
        const detail = details;
        const document = {
          html: template,
          data: {
            detail,
          },
          path: "./pdfs/attendance.pdf",
        };

        if (detail.length > 0) {
          pdf.create(document, options);
          res.send(Promise.resolve());
        } else {
          return res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          });
        }
      }
    }
  );
}

exports.pdfStudDept = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;
  const studentDept = req.params.studentDept;


  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ? AND att.department = ?",
    [labName, dateWise, studentBatch, academicYear, semester, studentDept],
    function (error, details, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      } else {
        const options = {
          format: "A4",
          orientation: "portrait",
        };
        const detail = details;
        const document = {
          html: template,
          data: {
            detail,
          },
          path: "./pdfs/attendance.pdf",
        };

        if (detail.length > 0) {
          pdf.create(document, options);
          res.send(Promise.resolve());
        } else {
          return res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          });
        }
      }
    }
  );
}
exports.pdfStudSection = (req, res) => {
  const labName = req.params.labName;
  const dateWise = req.params.dateWise;
  const studentBatch = req.params.studentBatch;
  const academicYear = req.params.academicYear;
  const semester = req.params.semester;
  const studentDept = req.params.studentDept;
  const section = req.params.section;

  connection.query(
    "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? AND DATE(att.logintime ) = ? AND  att.batch = ? AND academic_year = ? AND semester = ? AND att.department = ? AND section = ? ",
    [labName, dateWise, studentBatch, academicYear, semester, studentDept, section],
    function (error, details, fields) {
      if (error) {
        return res.status(400).json({
          error: "Failed to get Student detail",
        });
      } else {
        const options = {
          format: "A4",
          orientation: "portrait",
        };
        const detail = details;
        const document = {
          html: template,
          data: {
            detail,
          },
          path: "./pdfs/attendance.pdf",
        };

        if (detail.length > 0) {
          pdf.create(document, options);
          res.send(Promise.resolve());
        } else {
          return res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          });
        }
      }
    }
  );
}
