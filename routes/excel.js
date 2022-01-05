const express = require('express');
const router = express.Router();
const uploadFile = require('../middlewares/excel');
//import controller


const {
  upload,
  uploadUpdate,
  downloadPdf,
  excelStudent,
  pdfStudent
} = require('../controllers/excel');

router.post("/upload/excel", uploadFile, upload);
router.post("/upload/excelUpdate", uploadFile, uploadUpdate);
router.post("/attendance/excel", excelStudent);
router.post("/attendance/pdf", pdfStudent);
router.get("/attendance/pdf/download", downloadPdf);



module.exports = router; //{}

