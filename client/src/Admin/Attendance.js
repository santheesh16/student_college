import React, { useState, useEffect } from "react";
import Layout from "../components/Navbar";
import { getCookie, signout, setLocalStorage } from "../auth/helpers";
import Axios from "axios";
import "../App.css";
import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
const fileSaver = require("file-saver");

const Attendance = ({ history }) => {
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
    labNames: [],
    details: [],
    labDetails : []
  });

  useEffect(() => {
    loadBlock();
  }, []);

  const optionsView = (lists) => {
    return lists.map((el) => <option key={el}>{el}</option>);
  };

  let batchOption = null;
  let academicOption = null;

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
    labNames,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };


  const loadBlock = () => {
    Axios({
      method: "POST",
      url: "/api/lab/load-details/all",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("GET LAB SUCCESS", response.data);
        let labDetails = response.data
        for (var i = 0; i < response.data.length; i++) {
          labsDepartment.push(response.data[i].lab_department);
        }
        let dept = [];
        for (var i = 0, l = labsDepartment.length; i < l; i++) {
          if (
            dept.indexOf(labsDepartment[i]) === -1 &&
            labsDepartment[i] !== ""
          ) {
            dept.push(labsDepartment[i]);
          }
        }
        setValues({ ...values, labsDepartment: dept});
        let names = ["Choose Dept"]
        labNames.push(names)
        for (var i = 1; i < dept.length; i++) {
          names = []
          for (var j = 0; j < labDetails.length; j++) {
            if(dept[i] === labDetails[j].lab_department){
              names.push(labDetails[j].lab_name)
            }
          }
          labNames.push(names)
        }
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

  const loadAttendanceDetails = (event) => {
    let searchAttendance = {
      labName: labName,
      dateWise: dateWise,
      studentBatch: studentBatch,
      academicYear: academicYear,
      semester: semester,
      studentDept: studentDept,
      section: section,
      studentName: studentName,
    };
    const data = JSON.stringify({ searchColumns: searchAttendance });
    event.preventDefault();
    Axios({
      method: "POST",
      url: `/api/attendance/load-details`,
      data,
      headers: {
        "Content-Type": "application/json",
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
  };

  const downloadPdf = (event) => {
    event.preventDefault();
    let searchAttendance = {
      labName: labName,
      dateWise: dateWise,
      studentBatch: studentBatch,
      academicYear: academicYear,
      semester: semester,
      studentDept: studentDept,
      section: section,
      studentName: studentName,
    };
    const data = JSON.stringify({ searchColumns: searchAttendance });
    Axios.post(`/api/attendance/pdf`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        Axios.get(`/api/attendance/pdf/download`, {
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
  };

  const downloadExcel = (event) => {
    event.preventDefault();
    let searchAttendance = {
      labName: labName,
      dateWise: dateWise,
      studentBatch: studentBatch,
      academicYear: academicYear,
      semester: semester,
      studentDept: studentDept,
      section: section,
      studentName: studentName,
    };
    const data = JSON.stringify({ searchColumns: searchAttendance });
    Axios.post(`/api/attendance/excel`, data, {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
      },
    })
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
            {labsDepartment.length > 0 ? (
              optionsView(labsDepartment)
            ) : (
              <option>No Labs</option>
            )}
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
            {labDepartment.length > 0 ? (
              optionsView(labNames[labsDepartment.indexOf(labDepartment)])
            ) : (
              <option>Choose Dept</option>
            )}
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
            {labsDepartment.length > 0 ? (
              optionsView(labsDepartment)
            ) : (
              <option>No Labs</option>
            )}
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
            {details.length > 0 ? (
              details.map((el) => <option key={el}>{el.name}</option>)
            ) : (
              <option>No Student Loaded</option>
            )}
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
