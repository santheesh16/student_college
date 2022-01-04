const express = require("express");
const router = express.Router();

const {
  viewAttendanceDetails,
  viewLabBatchYearSection,
  viewLabBatchYear,
  viewLabDate,
  viewLabBatchAttendance,
  viewStudentDept,
  viewStudentSection,
  viewLabDetails,
  addLab,
  updateLab,
  deleteLab
} = require('../controllers/lab');


router.get("/attendance/load-details/:labName", viewAttendanceDetails)
router.get("/attendance/load-details/:labName/:dateWise", viewLabDate)
router.get("/attendance/load-details/:labName/:dateWise/:studentBatch", viewLabBatchAttendance)
router.get("/attendance/load-details/:labName/:dateWise/:studentBatch/:academicYear", viewLabBatchYear)
router.get("/attendance/load-details/:labName/:dateWise/:studentBatch/:academicYear/:semester", viewLabBatchYearSection)
router.get("/attendance/load-details/:labName/:dateWise/:studentBatch/:academicYear/:semester/:studentDept", viewStudentDept)
router.get("/attendance/load-details/:labName/:dateWise/:studentBatch/:academicYear/:semester/:studentDept/:section", viewStudentSection)


router.get("/lab/load-details/all", viewLabDetails);
router.post("/lab/add", addLab);
router.put("/lab/update", updateLab);
router.delete("/lab/delete/:lab_id", deleteLab);

//section
module.exports = router; //{}