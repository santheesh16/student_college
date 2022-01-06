import React, { useState } from "react";
import Layout from "../components/Navbar";
import axios from "axios";
import { isStudlog, getCookie } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./style.css";

const Lab = ({ history }) => {
  const [values, setValues] = useState({
    lab_name: "",
    lab_department: "",
    machine_no: "",
    tabSwitch: "",
    buttonText: "Submit",
  });

  let type = null;
  let options = null;
  /** Different arrays for different dropdowns */
  const CSE = [
    "Software Engineer",
    "Data Structure ",
    "Computer Network",
    "Redhat Interprised",
  ];
  const ECE = [
    "Computer Electrical", 
    "Programming Python"
  ];
  const EEE = [
    "Electronic Science",
    "Designing in Electronic",
    "Electrical Computer",
  ];
  const MECH = [
    "English Listening ",
    "Object Oriented",
    "Basics Computer Programming",
  ];
  const BIOMED = [
    "Staff Maintain Computer",
    "Student Details Lab",
    "Programming Lab"];
  const {
    lab_name,
    lab_department,
    machine_no,
    tabSwitch,
    buttonText,
  } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  /** Setting Type variable according to dropdown */
  if (lab_department === "CSE") { 
    type = CSE; 
  } else if (lab_department === "ECE") { 
    type = ECE; 
  } else if (lab_department === "EEE") { 
    type = EEE; 
  } else if (lab_department === "MECH") { 
    type = MECH; 
  } else if (lab_department === "BIOMED") { 
    type = BIOMED; 
  }
  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `/api/user/lab/${isStudlog().roll_number}`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      data: { lab_name, lab_department, machine_no },
    })
      .then((response) => {
        console.log("LAB SUCCESS", response.data);

        setValues({
          ...values,
          tabSwitch: response.data,
          buttonText: "Submitted",
        });
        isStudlog() && isStudlog().role === "student"
          ? window.open("https://www.google.com/")
          : history.push("/home");
        // google-home
        toast.success("Lab updated successfully");
      })
      .catch((error) => {
        console.log("LAB ERROR", error.response.data.error);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const LoggedIn = () => (
    <form>
      <div className="text-center login-success">
        <h2 className="text text-primary">You LoggedIn Successfully</h2>
        <p className="text text-danger">Don't close the tab</p>
        <span>Please Logout when your lab ends</span>
      </div>
    </form>
  );

  if (type) { 
    options = type.map((el) => <option key={el}>{el}</option>); 
  } 
  const labForm = () => (
    <form className="container col-md-10 border border-dark rounded mx-auto login-success ">
      <div className="form-group ">
        <p className="lead text-center">Enter Laboratory Details</p>
        <label className="col-form-label font-weight-bold">
          Lab Department
        </label>
        <select
          id="inputState"
          onChange={handleChange("lab_department")}
          type="text"
          value={lab_department}
          className="form-control"
        >
          <option selected>Choose Your Lab Department</option>
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>MECH</option>
          <option>BIOMED</option>
        </select>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="col-form-label font-weight-bold">Lab Name</label>
          <select
            id="inputState"
            onChange={handleChange("lab_name")}
            type="text"
            value={lab_name}
            className="form-control"
          >
            {options}
          </select>
        </div>
        <div className="form-group col-md-6">
          <label className="col-form-label font-weight-bold">Machine No</label>
          <select
            id="inputState"
            onChange={handleChange("machine_no")}
            type="text"
            value={machine_no}
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
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>
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
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        {tabSwitch === "" ? labForm() : LoggedIn()}
      </div>
    </Layout>
  );
};

export default Lab;
