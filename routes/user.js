const express = require('express');
const router = express.Router();

//import controller

const {
  requireSignin,
  adminMiddleware,
  signout,
} = require('../controllers/auth');
const {
  read,
  update,
  labUpdate,
  adminRead,
  adminUpdate,
  studentUnBlock,
  adminStudentRead,
  blockList,
  adminStudentUpdate,
  adminStduntDelete,
  studentBlock,
  studentPasswordUpdate
} = require('../controllers/user');
const { searchCheck } = require('../validators/index');

router.get("/user/:rollNumber", read);
router.put("/user/update", requireSignin, update);
router.put("/user/lab/:roll_number", requireSignin, labUpdate);

router.get("/admin/:id", adminRead);
router.put("/admin/adminUpdate", requireSignin, adminMiddleware, adminUpdate);
router.get("/admin/user/:rollNumber",requireSignin, searchCheck, adminStudentRead);
router.put("/admin/student/passwordUpdate", requireSignin, adminMiddleware, studentPasswordUpdate);
router.put("/admin/user/update/:rollNumber", requireSignin, adminStudentUpdate);
router.put("/admin/user/delete/:id", requireSignin, adminStduntDelete);
router.put("/user/student/signout/:roll_number", signout);
router.put("/admin/student/block", studentBlock);
router.put("/admin/student/unblock", studentUnBlock);
router.get("/admin/student/block-list", blockList);


//section
module.exports = router; //{}
