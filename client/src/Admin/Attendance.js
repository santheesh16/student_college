import React, { useState, useEffect } from "react";
import Layout from "../components/Navbar";
import { getCookie, signout, setLocalStorage } from "../auth/helpers";
import Axios from "axios";
import "../App.css";

import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
const fileSaver = require("file-saver");

const Attendance = ({ history }) => {
  const [contacts, setContacts] = useState([]);
  const [values, setValues] = useState({
    labName: "",
    labDepartment: "",
    dateWise: "",
    studentBatch: "",
    academicYear: "",
    section: "",
    semester: "",
    studentDept: "",
    studentName: "",
    buttonView: "File Download",
    labsDepartment: ["Choose..."],
    details: [],
  });

  let type = null;
  let options = null;
  let batchOption = null;
  let academicOption = null;
  let studentOption = null;
  let labsDept = null;

  const dateConversion = () => {
    var today = new Date();
    var yyyy = today.getFullYear();
    var batchOptions = ["Choose..."];

    var minusYear = yyyy - 4;
    for (var i = 0; minusYear <= yyyy; i++) {
      let endYear = yyyy + i;
      var yearTo = minusYear + "-" + endYear;
      batchOptions.push(yearTo);
      minusYear += 1;
    }

    batchOption = batchOptions.map((el) => <option key={el}>{el}</option>);
    if(labsDepartment.length != 0 ){
      
    }
    
    var academicOptions = ["Choose..."];


    if (studentBatch !== "Choose...") {
      var begYear = parseInt(studentBatch.substring(0, 4));
      var endYear = parseInt(studentBatch.substring(5, 9));
      today = new Date();
      var j = 1;
      for (i = begYear; i < endYear; i++) {
        var acadAdd = begYear + j;
        academicOptions.push(i + "-" + acadAdd);
        j++;
      }
    }

    academicOption = academicOptions.map((el) => (
      <option key={el}>{el}</option>
    ));
  };

  const handleChange = (name) => (event) => {
    console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    loadBlock();
  }, []);

  const loadBlock = () => {
    Axios({
      method: "GET",
      url: "http://localhost:8000/api/lab/load-details/all",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("GET LAB SUCCESS", response.data);
        for (var i = 0; i < response.data.length; i++) {
          labsDepartment.push(response.data[i].lab_department);
        }

        let a = [];
        for (var i=0, l=labsDepartment.length; i<l; i++){
        if (a.indexOf(labsDepartment[i]) === -1 && labsDepartment[i] !== ''){
            a.push(labsDepartment[i]);
          }
        }
        setValues({...values, labsDepartment: a });
        console.log(labsDepartment)
      })
      .catch((error) => {
        console.log("GET LAB  ERROR", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };
  /** Different arrays for different dropdowns */
  const CSE = [
    "Choose...",
    "Software Engineer",
    "Data Structure ",
    "Computer Network",
    "Redhat Interprised",
  ];
  const ECE = ["Choose...", "Computer Electrical", "Programming Python"];
  const EEE = [
    "Choose...",
    "Electronic Science",
    "Designing in Electronic",
    "Electrical Computer",
  ];
  const MECH = [
    "Choose...",
    "English Listening ",
    "Object Oriented",
    "Basics Computer Programming",
  ];
  const BIOMED = [
    "Choose...",
    "Staff Maintain Computer",
    "Student Details Lab",
    "Programming Lab",
  ];

  const {
    labName,
    labDepartment,
    dateWise,
    studentBatch,
    academicYear,
    section,
    semester,
    studentDept,
    buttonView,
    details,
    studentName,
    labsDepartment,
  } = values;

  /** Setting Type variable according to dropdown */
  if (labDepartment === "CSE") {
    type = CSE;
  } else if (labDepartment === "ECE") {
    type = ECE;
  } else if (labDepartment === "EEE") {
    type = EEE;
  } else if (labDepartment === "MECH") {
    type = MECH;
  } else if (labDepartment === "BIOMED") {
    type = BIOMED;
  }

  const downloadPdf = (event) => {
    event.preventDefault();
    if (
      labName !== "" &&
      dateWise === "" &&
      studentBatch === "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(`http://localhost:8000/api/attendance/pdf-labName/${labName}`)
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch === "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/pdf-dateWise/${labName}/${dateWise}`
      )
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/pdf-batch/${labName}/${dateWise}/${studentBatch}`
      )
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/pdf-acedemic/${labName}/${dateWise}/${studentBatch}/${academicYear}`
      )
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/pdf-semester/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}`
      )
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept !== "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/pdf-studDept/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}/${studentDept}`
      )
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept !== "" &&
      section !== ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/pdf-studSection/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}/${studentDept}/${section}`
      )
        .then((response) => {
          Axios.get(`http://localhost:8000/api/attendance/pdf/download`, {
            responseType: "blob",
          })
            .then((response) => {
              console.log("STUDENT ATTENDACNE GET", response.data);
              var blob = new Blob([response.data], { type: "application/pdf" });
              fileSaver.saveAs(blob, "Attendanace.pdf");
            })
            .catch((error) => {
              console.log(
                "STUDENT ATTENDACNE PDF DOWNLOAD ERROR",
                error.response
              );
              toast.error(error.response.data.error);
            });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else {
      toast.error("Please select correct sorted options!!!");
    }
  };

  const downloadExcel = (event) => {
    event.preventDefault();
    if (
      labName !== "" &&
      dateWise === "" &&
      studentBatch === "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-labName/${labName}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch === "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-dateWise/${labName}/${dateWise}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-batch/${labName}/${dateWise}/${studentBatch}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== "" &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-acedemic/${labName}/${dateWise}/${studentBatch}/${academicYear}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-semester/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept !== "" &&
      section === ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-studDept/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}/${studentDept}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept !== "" &&
      section !== ""
    ) {
      Axios.get(
        `http://localhost:8000/api/attendance/excel-studSection/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}/${studentDept}/${section}`,
        {
          responseType: "arraybuffer",
        }
      )
        .then((response) => {
          console.log("STUDENT ATTENDACNE EXCEl", response);
          var blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          fileSaver.saveAs(blob, "Attendanace.xlsx");
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE EXCEl ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else {
      toast.error("Please select options in correct order!!");
    }
  };
  const attendanceDetail = () => {
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Roll Number</th>
            <th>Register Number</th>
            <th>Name</th>
            <th>Department</th>
            <th>Lab Id</th>
            <th>Date</th>
            <th>Login Time</th>
            <th>Logout Time</th>
            <th>Machine No</th>
          </tr>
        </thead>
        {details.map((detail, index) => {
          return (
            <tbody>
              <tr>
                <td>{detail.id}</td>
                <td>{detail.roll_number}</td>
                <td>{detail.register_number}</td>
                <td>{detail.name}</td>
                <td>{detail.department}</td>
                <td>{detail.lab_id}</td>
                <td>{detail.date}</td>
                <td>{detail.logintime}</td>
                <td>{detail.logouttime}</td>
                <td>{detail.machine_no}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    );
  };
  if (type) {
    options = type.map((el) => <option key={el}>{el}</option>);
  }

  if (details) {
    studentOption = details.map((el) => <option key={el}>{el.name}</option>);
  }
  const loadAttendanceDetails = (event) => {
    event.preventDefault();
    if (
      labName !== "" &&
      dateWise === "" &&
      studentBatch === "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      console.log("Sample outpt1");
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch === "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}/${dateWise}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear === "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}/${dateWise}/${studentBatch}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester === "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}/${dateWise}/${studentBatch}/${academicYear}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept === "" &&
      section === ""
    ) {
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept !== "" &&
      section === ""
    ) {
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}/${studentDept}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    } else if (
      labName !== " " &&
      dateWise !== " " &&
      studentBatch !== "" &&
      academicYear !== "" &&
      semester !== "" &&
      studentDept !== "" &&
      section !== ""
    ) {
      Axios({
        method: "GET",
        url: `http://localhost:8000/api/attendance/load-details/${labName}/${dateWise}/${studentBatch}/${academicYear}/${semester}/${studentDept}/${section}`,
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
        .then((response) => {
          console.log("STUDENT ATTENDACNE GET", response);
          setValues({
            ...values,
            details: response.data,
          });
        })
        .catch((error) => {
          console.log("STUDENT ATTENDACNE GET ERROR", error.response);
          toast.error(error.response.data.error);
          if (error.response.status === 401) {
            signout(() => {
              history.push("/");
            });
          }
        });
    }
  };
  const attendence = () => (
    <form>
      <div className="form-row">
        <div className="form-group col-md-2">
          <label className="col-form-label">Lab Department</label>
          <select
            id="inputState"
            onChange={handleChange("labDepartment")}
            type="text"
            value={labDepartment}
            className="form-control"
          >
            { labsDepartment.length > 0 ?
            labsDept = labsDepartment.map((el) => <option key={el}>{el}</option>) : labsDept = ["No Labs"]}
          </select>
        </div>
        <div className="form-group col-md-2 ">
          <label className="col-form-label">Lab Name</label>
          <select
            id="inputState"
            onChange={handleChange("labName")}
            type="text"
            value={labName}
            className="form-control"
          >
            {options}
          </select>
        </div>
        <div className="form-group col-md-2 ">
          <label className="col-form-label">Date</label>
          <input
            type="date"
            id="birthday"
            onChange={handleChange("dateWise")}
            value={dateWise}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-2">
          <label className=" col-form-label">Batch</label>
          <select
            id="inputState"
            type="text"
            value={studentBatch}
            onChange={handleChange("studentBatch")}
            className="form-control"
          >
            {dateConversion()}
            {batchOption}
          </select>
        </div>
        <div className="form-group col-md-2">
          <label className=" col-form-label">Acadamic Year</label>
          <select
            id="inputState"
            type="text"
            value={academicYear}
            onChange={handleChange("academicYear")}
            className="form-control"
          >
            {/* {acedemic()} */}
            {academicOption}
          </select>
        </div>
        <div className="form-group col-md-1">
          <label className=" col-form-label">Semester</label>
          <select
            id="inputState"
            type="text"
            value={semester}
            onChange={handleChange("semester")}
            className="form-control"
          >
            <option selected>Choose...</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
          </select>
        </div>
        <div className="form-group col-md-2">
          <label className=" col-form-label">Student Department</label>
          <select
            id="inputState"
            type="text"
            value={studentDept}
            onChange={handleChange("studentDept")}
            className="form-control"
          >
            <option selected>Choose...</option>
            <option>CSE</option>
            <option>EEE</option>
            <option>ECE</option>
            <option>Mech</option>
            <option>BioMedical</option>
          </select>
        </div>
        <div className="form-group col-md-2">
          <label className=" col-form-label">Student Section</label>
          <select
            id="inputState"
            type="text"
            value={section}
            onChange={handleChange("section")}
            className="form-control"
          >
            <option selected>Choose...</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
        <div className="form-group col-md-2">
          <label className=" col-form-label">Student Name</label>
          <select
            id="inputState"
            type="text"
            value={studentName}
            onChange={handleChange("studentName")}
            className="form-control"
          >
            {studentOption}
          </select>
        </div>
        <div className="form-group col-md-2 p-3">
          <div class="dropdown">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
            >
              {buttonView}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a className="dropdown-item" onClick={downloadExcel}>
                Excel
              </a>
              <a className="dropdown-item" onClick={downloadPdf}>
                Pdf
              </a>
            </div>
          </div>
        </div>
        <div className="form-group col-md-1 p-3">
          <button className="btn btn-primary" onClick={loadAttendanceDetails}>
            Load details
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <Layout>
      <div>
        <ToastContainer />
        <p className="lead text-center">Select Laboratory</p>
        {attendence()}
        {details.length > 0 ? attendanceDetail() : " "}
      </div>

      {/* console.log(studentBatch); */}
    </Layout>
  );
};

export default Attendance;
