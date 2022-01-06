
const query = {


  CREATE_IF_NOT_EXIST_DB : "CREATE DATABASE IF NOT EXISTS student_details;",
  CREATE_IF_NOT_EXIST_ADMIN_TABLE: "CREATE TABLE IF NOT EXISTS admin (id int NOT NULL AUTO_INCREMENT, role varchar(10) NOT NULL DEFAULT 'admin', name varchar(45) NOT NULL, roll_number varchar(45) NOT NULL,password varchar(100) NOT NULL,PRIMARY KEY (id));",
  CREATE_IF_NOT_EXIST_STUDENT_TABLE:"CREATE TABLE IF NOT EXISTS students ( id int NOT NULL AUTO_INCREMENT, role varchar(10) DEFAULT 'student', roll_number varchar(50) DEFAULT NULL, register_number bigint DEFAULT NULL, name varchar(100) DEFAULT NULL, department varchar(40) DEFAULT NULL, section varchar(1) DEFAULT NULL, batch varchar(10) DEFAULT NULL, password varchar(200) DEFAULT NULL, createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, status tinyint DEFAULT '1', PRIMARY KEY (`id`)); ",
  CREATE_IF_NOT_EXIST_LAB_TABLE: "CREATE TABLE IF NOT EXISTS lab_details (lab_id int NOT NULL AUTO_INCREMENT, lab_name varchar(50) NOT NULL, lab_department varchar(50) NOT NULL, current_lab tinyint NOT NULL DEFAULT '0', PRIMARY KEY (lab_id)) ;",
  CREATE_IF_NOT_EXIST_ATTENDANCE_TABLE: "CREATE TABLE IF NOT EXISTS attendances (id int NOT NULL AUTO_INCREMENT, role varchar(45) DEFAULT 'student', roll_number varchar(50) NOT NULL, register_number bigint NOT NULL, name varchar(30) NOT NULL, department varchar(20) NOT NULL, section varchar(1) DEFAULT NULL, batch varchar(10) DEFAULT NULL, academic_year varchar(10) DEFAULT NULL, semester int DEFAULT NULL, logintime datetime DEFAULT NULL, logouttime datetime DEFAULT NULL, lab_id int DEFAULT NULL, machine_no int DEFAULT NULL, createdAt datetime DEFAULT CURRENT_TIMESTAMP, updatedAt datetime DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), KEY FK_lab_id_idx (lab_id), CONSTRAINT FK_lab_id FOREIGN KEY (lab_id) REFERENCES lab_details (lab_id)); ",
  ADD_ADMIN: "INSERT INTO admin SET ?;",

  /* Admin and Student signin and out */
  //View Roll Number 
  STUDENT_ROLLNUMBER: "SELECT * FROM students WHERE roll_number = ?;",
  ADMIN_ROLLNUMBER: "SELECT * FROM admin WHERE admin.roll_number = ?;",
  ADMIN_ID: "SELECT * FROM admin WHERE id = ?;",
  UPDATE_ADMIN: "UPDATE admin SET password = ? WHERE id = ? ;",
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

  /* Lab deatils Queries */
  GET_LAB_NAME: "SELECT lab_name FROM lab_details WHERE lab_department = ?;",
  GET_LABS_DETAILS: "SELECT * FROM lab_details;",
  GET_LAB_DETAILS: "SELECT * FROM lab_details WHERE lab_id = ?;",
  GET_BLOCKED_STUDENT: "SELECT students.roll_number FROM students WHERE students.status = 0;",
  ADD_LAB_DETAILS: "INSERT INTO lab_details SET ?;",
  UPDATE_LAB_DETAILS: "UPDATE lab_details SET ? WHERE lab_id = ? ;",
  DELETE_LAB : "DELETE FROM lab_details WHERE lab_id = ?;",


  GET_STUDENT: "SELECT * FROM students WHERE roll_number = ?;",
  UPDATE_STUDENT: "UPDATE students SET ? WHERE roll_number = ? ;",
  DELETE_STUDENT: "DELETE FROM student WHERE id = ?;",
  UPDATE_BLOCK_STUDENT: "UPDATE students SET students.status = 0 WHERE students.roll_number = ?;",
  UPDATE_UNBLOCK_STUDENT: "UPDATE students SET students.status = 1 WHERE students.roll_number = ?;",

  GET_LAB_ID: "SELECT lab_id FROM lab_details WHERE  lab_name = ? AND lab_department = ?;",
  UPDATE_ATTENDANCE: "UPDATE attendances SET lab_id = ? , machine_no = ? WHERE roll_number = ? ;",

  GET_STUDENT_DEAULT_PASSWORD: "Select default (password) as defaultPass from students;",
  UPDATE_STUDENT_DEAULT_PASSWORD: "ALTER TABLE students ALTER password SET DEFAULT ?;",
};


module.exports =
        Object.freeze(query);
