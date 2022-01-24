const bcrypt = require("bcrypt");
const connection = require("../config/config.js");
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require("path");
const template = fs.readFileSync(
  path.resolve(__dirname, "../template/template.html"),
  "utf-8"
);
let Query = require("../constant");

exports.upload = (req, res, done) => {
  if (req.file == undefined) {
    return done(null, res.status(400).json({
      message: "Please upload an excel file!",
    }));
  }
  let path =
    __basedir +
    "/studentcollege/resourses/static/assets/uploads/" +
    req.file.filename;
  readXlsxFile(path).then((rows) => {
    // skip headerdd
    rows.shift();
    rows.forEach((row) => {
      connection.query(
        Query.ADD_EXCEL_STUDENT,
        [row],
        function (error, user, fields) {
          if (error) {
            console.log("ADD STUDENT ERROR", error);
            return done(null, res.status(400).json({
              error: "Please!! Remove Id Column in Excel",
            }));
          }
        }
      );
    });
    return done(null, res.json({
      message: "Students details successfully added",
    }));
  });
};

exports.uploadUpdate = (req, res, done) => {
  if (req.file == undefined) {
    return done(null, res.status(400).json({
      message: "Please upload an excel file!",
    }));
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
        Query.UPDATE_EXCEL_STUDENT,
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
            return done(null, res.status(400).json({
              error: "Failed to store the students ",
            }));
          }
        }
      );
    });
    return done(null, res.json({
      message: "Students details successfully upated",
    }));
  });
};


const resExcel = (students, res, done) => {
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

  return done(null, workbook.xlsx.write(res).then(function () {
    res.status(200).end();
  }));
};

exports.excelStudent = (req, res, done) => {
  let details = req.body.searchColumns;
  console.log(req.body)
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
    function (error, students, fields) {
      if (error) {
        return done(null, res.status(400).json({
          error: "Failed to get Student details",
        }));
      } else {
        resExcel(students, res);
      }
    }
  );
};


exports.downloadPdf = (req, res, done) => {
  setTimeout(() => {
    var data = fs.readFileSync(
      path.resolve(__dirname, "../pdfs/attendance.pdf")
    );
    res.contentType("application/pdf");
    done(null, res.send(data));
  }, 4000);
};


exports.pdfStudent = (req, res, done) => {
  let details = req.body.searchColumns;
  console.log(req.body)
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
    function (error, details, fields) {
      if (error) {
        return done(null, res.status(400).json({
          error: "Failed to get Student detail",
        }));
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
          done(null, res.send(Promise.resolve()));
        } else {
          return done(null, res.status(400).json({
            error: "No data Found!! Pdf Not Created",
          }));
        }
      }
    }
  );
};
