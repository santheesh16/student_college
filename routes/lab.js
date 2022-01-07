const express = require("express");
const router = express.Router();

const {
  viewLabName,
  viewStudentAttendance,
  viewLabDetails,
  addLab,
  updateLab,
  deleteLab
} = require('../controllers/lab');


router.post("/attendance/load-details", viewStudentAttendance)
router.post("/lab/load-details/all", viewLabDetails);
router.post("/lab/add", addLab);
router.put("/lab/update", updateLab);
router.delete("/lab/delete/:lab_id", deleteLab);
router.post("/lab/name", viewLabName);


//section
module.exports = router; //{}