import React, { useState, useEffect} from "react";
import Layout from "../components/Navbar";
import axios from "axios";
import { isStudlog, getCookie, signout } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import "./style.css";

const Lab = ({ history }) => {
  const [values, setValues] = useState({
    labName: "",
    labDepartment: "",
    machine_no: "",
    tabSwitch: "",
    buttonText: "Submit",
    labsDepartment: ["Choose..."],
    labNames: [],
  });

  const {
    labName,
    labDepartment,
    machine_no,
    tabSwitch,
    buttonText,
    labsDepartment,
    labNames
  } = values;

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
    console.log(labName)
  };

  useEffect(() => {
    loadBlock();
  }, []);

  const optionsView = (lists) => {
    return lists.map((el) => <option key={el}>{el}</option>);
  };
  
  const loadBlock = () => {
    axios({
      method: "POST",
      url: "/api/lab/load-details/all",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("GET LAB SUCCESS", response.data);
        let labDetails = response.data
        console.log(labDetails)
        for (let i = 0; i < response.data.length; i++) {
          labsDepartment.push(response.data[i].lab_department);
        }
        let dept = [];
        for (let i = 0, l = labsDepartment.length; i < l; i++) {
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
        console.log(labNames)
        for (let i = 1; i < dept.length; i++) {
          names = ["Choose..."]
          for (var j = 0; j < labDetails.length; j++) {
            
            if(dept[i] === labDetails[j].lab_department){
              names.push(labDetails[j].lab_name)
            }
          }
          labNames.push(names)
        }
        console.log(labNames)
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
  const clickSubmit = (event) => {
    event.preventDefault();
    console.log(labName)
    let labUpdate = {
      labName: labName,
      labDpt: labDepartment,
      machineNo: machine_no,
    };
    const data = JSON.stringify({ searchColumns: labUpdate });
    setValues({ ...values, buttonText: "Submitting" });
    axios({
      method: "PUT",
      url: `/api/user/lab/${isStudlog().roll_number}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("token")}`,
      },
      data,
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

  const labForm = () => (
    <form className="container col-md-10 border border-dark rounded mx-auto login-success ">
      <div className="form-group ">
        <p className="lead text-center">Enter Laboratory Details</p>
        <label className="col-form-label font-weight-bold">
          Lab Department
        </label>
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
      <div className="form-row">
        <div className="form-group col-md-6">
          <label className="col-form-label font-weight-bold">Lab Name</label>
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
