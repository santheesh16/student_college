import React, { useState } from "react";
import Layout from "../components/Navbar";
import Axios from "axios";
import {
  isStud,
  getCookie,
  signout,
  updateAdmin,
  deleteStud,
} from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Update = ({ history }) => {
  const [search_roll, setSearch_roll] = useState("");

  const [values, setValues] = useState({
    roll_number: "",
    register_number: "",
    name: "",
    department: "",
    section: "",
    batch: "",
    password: "",
    buttonText: "Update",
  });

  const [file, setFile] = useState();
  const [filename, setFilename] = useState("Choose File");

  const {
    roll_number,
    register_number,
    name,
    department,
    section,
    batch,
    password,
    buttonText,
  } = values;

  var batchOption = null;

  const dateConversion = () => {
    var today = new Date();
    var yyyy = today.getFullYear();
    var batchOptions = ["Choose..."]; 

    var minusYear = yyyy - 4;
    for(var i = 0; minusYear <= yyyy; i++){
      var endYear = yyyy + i;
      var yearTo = minusYear +"-"+ endYear ;
      batchOptions.push(yearTo);
      minusYear += 1;
    }
    batchOption = batchOptions.map((el) => <option key={el}>{el}</option>);
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const clickFileSubmit = (event) => {
    event.preventDefault();
    var data = new FormData();
    data.append("file", file);
    Axios.post("http://localhost:8000/api/upload/excelUpdate", data)
      .then((response) => {
        console.log("FILE SUCCESS", response);
        toast.success("File Uploaded Successfully");
      })
      .catch((error) => {
        console.log("FILE ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  };

  const searchChange = (event) => {
    setSearch_roll(event.target.value);
  };

  const loadProfile = (event) => {
    event.preventDefault();
    Axios({
      method: "GET",
      url: `http://localhost:8000/api/admin/user/${search_roll}`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("STUDENT PROFILE UPDATE", response);
        const {
          roll_number,
          register_number,
          department,
          name,
          section,
          batch
        } = response.data;
        updateAdmin(response, () => {
          setValues({
            ...values,
            setSearch_roll: "",
            roll_number,
            register_number,
            department,
            name,
            section,
            batch,
          });
        });
      })
      .catch((error) => {
        toast.error("Roll Number Not Found");
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };

  const handleChange = (name) => (event) => {
    // console.log(event.target.value);
    setValues({ ...values, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Updatting" });
    Axios({
      method: "PUT",
      url: `http://localhost:8000/api/admin/user/update/${isStud().roll_number}`,
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      data: {
        roll_number,
        register_number,
        department,
        name,
        section,
        batch,
        password,
      },
    })
      //"
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
        deleteStud(response, () => {
          setValues({
            ...values,
            setearch_roll: "",
            name: "",
            roll_number: "",
            register_number: "",
            department: "",
            section: "",
            batch: "",
            buttonText: "Updated",
          });
          toast.success("Profile updated successfully");
        });
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        setValues({ ...values, buttonText: "Submit" });
        toast.error(error.response.data.error);
      });
  };

  const updateForm = () => (
    <form className="container col-md-10 border border-dark rounded mx-auto ">
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
            onChange={handleChange("roll_number")}
            value={roll_number}
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
            onChange={handleChange("register_number")}
            value={register_number}
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
        <h2 className="text-center">Update Student Details</h2>
        <div className="d-flex justify-content-end col-11 p-2 bd-highligh">
          <form class="form-inline my-2 my-lg-0">
            <input
              class="form-control mr-sm-2"
              value={search_roll}
              onChange={searchChange}
              className="form-control"
              type="search"
              placeholder="Search Roll Number"
              aria-label="Search"
            />
            <button
              class="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              onClick={loadProfile}
            >
              Search
            </button>
          </form>
        </div>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Update;
