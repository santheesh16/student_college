const express = require('express');
const router = express.Router();
const uploadFile = require('../middlewares/excel');
//import controller

const {
  upload,
  uploadUpdate,
  downloadPdf,
  getStudents,
  pdfDateWise,
  excelLabName,
  excelDateWise,
  excelBatch,
  excelAcademic,
  excelSemester,
  excelStudDept,
  excelStudSection,
  pdfLabName,
  pdfAcademic,
  pdfSemester,
  pdfStudDept,
  pdfStudSection,
  pdfBatch
} = require('../controllers/excel');

router.post("/upload/excel", uploadFile, upload);
router.post("/upload/excelUpdate", uploadFile, uploadUpdate);
router.get("/attendance/pdf/download", downloadPdf);

router.get("/student/all", getStudents);


router.get("/attendance/excel-labName/:labName", excelLabName);
router.get("/attendance/excel-dateWise/:labName/:dateWise", excelDateWise);
router.get("/attendance/excel-batch/:labName/:dateWise/:studentBatch", excelBatch);
router.get("/attendance/excel-acedemic/:labName/:dateWise/:studentBatch/:academicYear", excelAcademic);
router.get("/attendance/excel-semester/:labName/:dateWise/:studentBatch/:academicYear/:semester", excelSemester);
router.get("/attendance/excel-studDept/:labName/:dateWise/:studentBatch/:academicYear/:semester/:studentDept", excelStudDept);
router.get("/attendance/excel-studSection/:labName/:dateWise/:studentBatch/:academicYear/:semester/:studentDept/:section", excelStudSection);


router.get("/attendance/pdf-labName/:labName", pdfLabName);
router.get("/attendance/pdf-dateWise/:labName/:dateWise", pdfDateWise);
router.get("/attendance/pdf-batch/:labName/:dateWise/:studentBatch", pdfBatch);
router.get("/attendance/pdf-acedemic/:labName/:dateWise/:studentBatch/:academicYear", pdfAcademic);
router.get("/attendance/pdf-semester/:labName/:dateWise/:studentBatch/:academicYear/:semester", pdfSemester);
router.get("/attendance/pdf-studDept/:labName/:dateWise/:studentBatch/:academicYear/:semester/:studentDept", pdfStudDept);
router.get("/attendance/pdf-studSection/:labName/:dateWise/:studentBatch/:academicYear/:semester/:studentDept/:section", pdfStudSection);




module.exports = router; //{}

