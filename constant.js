
const query = {

  /* Admin and Student signin and out */
  //View Roll Number 
  STUDENT_ROLLNUMBER: "SELECT * FROM students WHERE roll_number = ?;",
  ADMIN_ROLLNUMBER: "SELECT * FROM admin WHERE admin.roll_number = ?;",
  ADMIN_ID: "SELECT * FROM admin WHERE id = ?;",
  ATTENDANCE_ROLLNUMBER: "SELECT * FROM attendances WHERE attendances.roll_number = ?;",
  //Insert Lab, Student
  ADD_STUDENT: "INSERT INTO students SET ? ;",
  ADD_ATTENDANCE: "INSERT INTO attendances SET ? ;",
  //Update Attendance, Lab, Student
  UPDATE_STUD_LOGOUT: "UPDATE attendances SET logouttime = ? WHERE roll_number = ? ;",

  /* Admin and Student signin and out */
  ADD_EXCEL_STUDENT: "INSERT INTO students (roll_number, register_number, name, department, section, batch) VALUES (?);",
  UPDATE_EXCEL_STUDENT: "UPDATE students SET students.roll_number = ?, students.register_number = ?, students.name = ?, students.department = ?, students.section = ?, students.batch = ?, students.password = ? WHERE roll_number = ?",

  //Excel Download Queries
  LAB_NAME: "SELECT att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name = ? ; ",
  ATTENDANCE_DETAIL: "SELECT  att.id, att.roll_number, att.register_number, att.name, att.department, ld.lab_name, ld.lab_department, att.section, att.semester, att.batch  ,DATE_FORMAT(att.logintime,'%d-%m-%Y') date,DATE_FORMAT(att.logintime,'%h:%i:%s') logintime,  DATE_FORMAT(att.logouttime,'%h:%i:%s') logouttime, att.machine_no , att.lab_id FROM attendances as att INNER JOIN lab_details as ld WHERE att.lab_id = ld.lab_id AND  ld.lab_name LIKE ? and att.logintime LIKE ? AND  att.batch LIKE ? AND academic_year LIKE ? AND semester LIKE ? AND att.department LIKE ? AND section LIKE ? AND att.name LIKE ?;",

  GET_LAB_NAME: "SELECT lab_name FROM lab_details WHERE lab_department = ?;",
  GET_LABS_DETAILS: "SELECT * FROM lab_details;",
  GET_LAB_DETAILS: "SELECT * FROM lab_details WHERE lab_id = ?;",

  ADD_LAB_DETAILS: "INSERT INTO student_details.lab_details SET ?;",
  UPDATE_LAB_DETAILS: "UPDATE lab_details SET ? WHERE lab_id = ? ;",
  DELETE_LAB : "DELETE FROM lab_details WHERE lab_id = ?;",
};


module.exports =
        Object.freeze(query);
