import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { authenticate, isAuth } from "../auth/helpers";
import { ToastContainer, toast } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';
import "../App.css";
import KPR_LOGO from "../assets/img/Kprlogo.webp";
import Axios from "axios";

const Signin = ({ history }) => {
  const [values, setValues] = useState({
    roll_number: "18st1",
    password: "kpriet@123",
    buttonText: "Submit"
  });

  const { roll_number, password, buttonText } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Submitting" });

    Axios.post("/api/signin", {
      roll_number: roll_number,
      password: password
    })
      .then((response) => {
        console.log("SIGNIN SUCCESS", response);
        //save the response
        authenticate(response, () => {
          setValues({
            ...values,
            roll_number: "",
            register_number: "",
            name: "",
            department: "",
            password: "",
            buttonText: "Submitted",
          });
          isAuth() && isAuth().role === 'admin'
            ? history.push("/lab-attendance")
            : history.push("/home");
        });
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const signinForm = () => (

    <div className="container col-sm-11 border border-dark rounded bg-light p-3 ">
      <form>
        <div className="form-group">

          <label className="col-sm-5 col-form-label font-weight-bold ">Roll Number</label>
          <input onChange={handleChange('roll_number')} value={roll_number} type="text" className="form-control" />
        </div>
        <div className="form-group">
          <label className="col-sm-5 col-form-label font-weight-bold">Password</label>
          <input onChange={handleChange('password')} value={password} type="text" className="form-control" />
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <button className="btn btn-primary" onClick={clickSubmit}>
              {buttonText}
            </button>
          </div>
          <div className="form-group col-md-6">
            <p className="forgot-password text-right">
              Forgot <a href="/forgot">password?</a>
            </p>
          </div>

        </div>

      </form>
    </div>
  );

  return (
    <div className="bg">
      <img src={KPR_LOGO} alt="clg-logo" width="400px" height="150px" />
      <div className="col-md-5 offset-md-3 p-3">
        <ToastContainer />
        {isAuth() ? <Redirect to="/" /> : null}
        {signinForm()}
      </div>
    </div>
  );
};

export default Signin;

