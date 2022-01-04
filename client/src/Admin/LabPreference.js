import React, { useState } from "react";
import Layout from "../components/Navbar";
import axios from "axios";
import {  getCookie, updateAdminReset } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import ".././App.css"

const LabPreference = ({ history }) => {
  const [values, setValues] = useState({
    oldStudentPassword: "",
    newStudentPassword: "",
    showPassword: false,
    buttonText: "Submit",
  });

  const token = getCookie("token");

  const { newStudentPassword, oldStudentPassword, showPassword, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });
    console.log(oldStudentPassword, newStudentPassword)
    axios.put('http://localhost:8000/api/admin/student/passwordUpdate',
    {oldStudentPassword, newStudentPassword},{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
        updateAdminReset(response, () => {
          setValues({
            ...values,
            oldStudentPassword: "",
            newStudentPassword: "",
            showPassword: false,
            buttonText: "Submitted",
          });
          toast.success(" Password Successfully Updated ");
        });
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const setDefaultPassword = () => (
    <form >
      <p className="lead text-center  ">Change Student Default Password</p>
      <div className="form-group">
        <label className="text-muted">Old Password</label>
        <input
          onChange={handleChange("oldStudentPassword")}
          value={oldStudentPassword}
          type={showPassword ? 'text' : 'password'} 
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">New Password</label>
        <input
          onChange={handleChange("newStudentPassword")}
          value={newStudentPassword}
          type={showPassword ? 'text' : 'password'} 
          className="form-control"
        />
      </div>
      <div className="form-group">
            <input onChange={() => setValues({ ...values, showPassword : !showPassword})} type="checkbox" checked={showPassword}/> Show Password
            </div>
      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );


  
  return (  
    <Layout>
      <div className="col-md-6 offset-md-3 lab-details" >
        <ToastContainer />
        {setDefaultPassword()}
      </div>
    </Layout>
  );
};

export default LabPreference;


/* 
Added Works
1. Icons for Option
2. Colors and Font


Errors Chnanges
1. File Upload works
2. Checks all get,put,post options

*/
