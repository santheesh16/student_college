import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { authenticate, isAuth } from "../auth/helpers";
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';
import "../App.css";
import Axios from "axios";

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    roll_number: "18st1",
    password: "kpriet@123",
    buttonText: "Submit",
  });

  const [bgColor, setBgColor] = useState("#f8f9fa"); // Initial background color

  const { roll_number, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });

    Axios.post("/api/signin", {
      roll_number: roll_number,
      password: password,
    })
      .then((response) => {
        console.log("SIGNIN SUCCESS", response);
        authenticate(response, () => {
          setValues({
            ...values,
            roll_number: "",
            password: "",
            buttonText: "Submitted",
          });
          isAuth() && isAuth().role === "admin"
            ? history.push("/lab-attendance")
            : history.push("/home");
        });
        setBgColor("#d4edda"); // Change background color on successful sign-in
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
        setBgColor("#f8d7da"); // Change background color on error
      });
  };

  const signinForm = () => (
    <div className="container border border-dark p-4">
      <form>
        <div className="form-group">
          <label className="font-weight-bold">Employee ID</label>
          <input
            onChange={handleChange("roll_number")}
            value={roll_number}
            type="text"
            className="form-control"
            placeholder="Enter Employee ID"
          />
        </div>
        <div className="form-group">
          <label className="font-weight-bold">Password</label>
          <input
            onChange={handleChange("password")}
            value={password}
            type="password"
            className="form-control"
            placeholder="Enter Password"
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <button className="btn btn-primary" onClick={clickSubmit}>
              {buttonText}
            </button>
          </div>
          <div className="form-group col-md-6">
            <p className="forgot-password text-right">
              Forgot <Link to="/forgot">password?</Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div
      className="d-flex justify-content-center align-items-center bg"
      style={{
        minHeight: "100vh",
        backgroundColor: bgColor, // Dynamic background color
      }}
    >
      <div className="col-md-4 d-flex flex-column align-items-center">
        <h1 className="text-white text-center">Private Limited Company (Pvt Ltd)</h1>
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        {signinForm()}
      </div>
    </div>
  );
  

  
};

export default Signin;
