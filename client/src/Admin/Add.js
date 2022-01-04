import React, { useState } from "react";
import Axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../components/Navbar";

const Signup = () => {
  const [values, setValues] = useState({
    rollNumber: "",
    registerNumber: "",
    name: "",
    department: "",
    section: "",
    batch: "",
    password: "",
    buttonText: "Submit",
  });

  const [file, setFile] = useState();
  const [filename, setFilename] = useState("Choose File");
  const {
    rollNumber,
    registerNumber,
    name,
    department,
    section,
    batch,
    password,
    buttonText,
  } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  var batchOption = null;

  const dateConversion = () => {
    var today = new Date();
    var yyyy = today.getFullYear();
    var batchOptions = ["Choose..."];

    var minusYear = yyyy - 4;
    for (var i = 0; minusYear <= yyyy; i++) {
      var endYear = yyyy + i;
      var yearTo = minusYear + "-" + endYear;
      batchOptions.push(yearTo);
      minusYear += 1;
    }
    batchOption = batchOptions.map((el) => <option key={el}>{el}</option>);
  };

  const clickFileSubmit = (event) => {
    event.preventDefault();
    var data = new FormData();
    data.append("file", file);

    Axios.post("http://localhost:8000/api/upload/excel", data)
      .then((response) => {
        console.log("FILE SUCCESS", response);
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("FILE ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    Axios({
      method: "POST",
      url: "http://localhost:8000/api/signup",
      data: {
        rollNumber,
        registerNumber,
        name,
        department,
        section,
        batch,
        password,
      },
    })
      .then((response) => {
        console.log("SIGNUP SUCCESS", response);
        setValues({
          ...values,
          rollNumber: "",
          registerNumber: "",
          name: "",
          department: "",
          section: "",
          batch: "",
          password: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("SIGNUP ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const signupForm = () => (
    <form className="container col-md-12 border border-dark rounded mx-auto ">
      <form onSubmit={clickFileSubmit}>
        <div className="form-row">
          <div className="form-group col-md-6 mt-4">
            <input
              type="file"
              className="custom-file-input"
              id="myFile"
              onChange={onChange}
            />
            <label className="custom-file-label" htmlFor="customFile">
              {filename}
            </label>
          </div>
          <div className="form-group col-md-3">
            <button type="submit" className="btn btn-primary btn-block mt-4">
              Upload
            </button>
          </div>
        </div>
      </form>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="col-form-label">Name</label>
          <input
            onChange={handleChange("name")}
            type="text"
            value={name}
            className="form-control"
          />
        </div>
        <div className="form-group col-md-6">
          <label className="col-form-label">Roll Number</label>
          <input
            onChange={handleChange("rollNumber")}
            value={rollNumber}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group col-md-6">
          <label className="col-form-label">Batch</label>
          <select
            id="inputState"
            onChange={handleChange("batch")}
            type="text"
            value={batch}
            className="form-control"
          >
            {dateConversion()}
            {batchOption}
          </select>
        </div>
        <div className="form-group col-md-6">
          <label className="col-form-label">Register Number</label>
          <input
            onChange={handleChange("registerNumber")}
            value={registerNumber}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group col-md-6">
          <label className="col-sm-2 col-form-label">Department</label>
          <select
            id="inputState"
            onChange={handleChange("department")}
            type="text"
            value={department}
            className="form-control"
          >
            <option>Choose...</option>
            <option>CSE</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>MECH</option>
            <option>BIOMED</option>
          </select>
        </div>

        <div className="form-group col-md-4">
          <label className="col-sm-2 col-form-label">Section</label>
          <select
            id="inputState"
            onChange={handleChange("section")}
            type="text"
            value={section}
            className="form-control"
          >
            <option>Choose...</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label className="col-sm-5 col-form-label">Password</label>
        <input
          onChange={handleChange("password")}
          value={password}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-8 offset-md-2 container">
        <ToastContainer />
        <h2 className="text-center">Add Student Details</h2>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
