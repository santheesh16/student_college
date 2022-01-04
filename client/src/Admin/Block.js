import React, { useState, useEffect } from "react";
import Layout from "../components/Navbar";
import "../App.css";
import axios from "axios";
import { getCookie, signout, deleteStud } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const Block = ({ history }) => {
  const [values, setValues] = useState({
    rollNumber: "",
    blockLists: [],
    buttonText: "Block",
    buttonUnblock: "Unblock",
  });

  const { rollNumber, blockLists } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const clickUnBlockSubmit = (event) => {
    console.log(rollNumber);
    event.preventDefault();
    setValues({ ...values, buttonUnblock: "Unblocking" });
    axios({
      method: "PUT",
      url: "http://localhost:8000/api/admin/student/unblock",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      data: {
        rollNumber,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
        deleteStud(response, () => {
          setValues({
            ...values,
            rollNumber: "",
            registerNumber: "",
            department: "",
            name: "",
            buttonUnblock: "Unblocked",
          });
        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        setValues({ ...values, buttonUnblock: "Unblock" });
        toast.error(error.response.data.error);
      });
  };

  const clickDelete = (event) => {
    event.preventDefault();
    axios({
      method: "DELETE",
      url: "http://localhost:8000/api/lab/delete/:labId"
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        setValues({
          ...values,
          labId: "",
          labName: "",
          labDept: "",

        });
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ADDLAB ERROR", error.response.data);
        setValues({ ...values, buttonText: "Add" });
        toast.error(error.response.data.error);
      });
  }

  const clickBlockSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: "Blocking" });
    axios({
      method: "PUT",
      url: "http://localhost:8000/api/admin/student/block",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
      data: {
        rollNumber,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE SUCCESS", response);
        deleteStud(response, () => {
          setValues({
            ...values,
            rollNumber: "",
            registerNumber: "",
            department: "",
            name: "",
            buttonText: "Blocked",
          });
        });
        toast.success("Student Profile Blocked successfully");
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        setValues({ ...values, buttonText: "Block" });
        toast.error(error.response.data.error);
      });
  };

  useEffect(() => {
    loadBlock();
  },[]);

  const loadBlock = () => {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/admin/student/block-list",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response.data);
        setValues({
          blockLists: response.data,
          buttonText: "Block",
          buttonUnblock: "Unblock",
        });
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  };
  const blockShow = blockLists.map((rollNum, index) => {
    console.log(rollNum.roll_number, index);
    return (
      <li
        class="list-group-item "
        key={index}
        onClick={() => {
          setValues({ ...values, rollNumber: rollNum.roll_number });
        }}
      >
        <div className="row">
          <div className="p-3">{rollNum.roll_number}</div>

          <div className="d-flex justify-content-end">
            <button
              className=" btn btn-outline-success my-3 my-sm-2"
              key={index}
              onClick={clickUnBlockSubmit}
            >
              Unblock
            </button>
          </div>
        </div>
      </li>
    );
  });

  const addingForm = () => (
    <div class="container">
      <div class="row">
        <form className="container col-md-6 border border-dark rounded mx-auto p-3">
          {searchBox()}
          <h3 className="d-flex justify-content-center">Blocked List</h3>
          <ul class="list-group">{blockShow}</ul>
        </form>
      </div>
    </div>
  );

  const searchBox = () => (
    <div className="d-flex justify-content-end p-2 bd-highligh">
      <form class="form-inline my-2 my-lg-0 p-2">
        <input
          class="row form-control mr-sm-2"
          value={rollNumber}
          onChange={handleChange("rollNumber")}
          className="form-control"
          type="search"
          placeholder="Search Roll Number"
          aria-label="Search"
        />
        <button
          className="btn btn-outline-success my-2 my-sm-0"
          type="submit"
          onClick={clickBlockSubmit}
        >
          Block
        </button>
      </form>
    </div>
    // clickLoad
  );
  return (
    <Layout>
      <div className="row">
        <ToastContainer />
        <div className="col-md-8 offset-md-2 container p-2">{addingForm()}</div>
      </div>
    </Layout>
  );
};

export default Block;
