import React, { useState,useEffect } from "react";
import Layout from "../components/Navbar";
import axios from "axios";
import {  getCookie, signout, setLocalStorage } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";

const LabDetails = ({ history }) => {
  const [values, setValues] = useState({
    labId: "",
    labName: "",
    labDept: "",
    labsList: [],
    editOption: false,
    editButton: "Edit",
    deleteButton: "Delete"
  });

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  useEffect(() => {
    loadBlock();
  },[]);

  const loadBlock = () => {
    console.log(disabled);
    axios({
      method: "GET",
      url: "/api/lab/load-details/all",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response.data);
        setLocalStorage('labs', response.data);
        setValues({
          labsList: response.data,
          editButton: "Edit",
          deleteButton: "Delete"
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


  const clickAdd = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: "/api/lab/add",
      data: {
        labId,
        labName,
        labDept
      },
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        setValues({
          ...values,
          labId: "",
          labName: "",
          labDept: "",
          editButton: "Added",
        });
        loadBlock();
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ADDLAB ERROR", error.response.data);
        setValues({ ...values, buttonText: "Add" });
        toast.error(error.response.data.error);
      });
  }

  const clickEdit = (event) => {
    event.preventDefault();
    axios({
      method: "PUT",
      url: `/api/lab/update`,
      data: {
        labId: editFormData.labId,
        labName: editFormData.labName,
        labDept: editFormData.labDept,
      }
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        
        loadBlock();
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ADDLAB ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  }
  const clickDelete = (event) => {
   
    event.preventDefault();
    axios({
      method: "DELETE",
      url: `/api/lab/delete/${lab_id}`
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        setValues({
          ...values,
          labId: "",
          labName: "",
          labDept: "",
        });
        loadBlock();
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("ADDLAB ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  }

  const labDetails = () => {
    return(
      <form >
      <h3 className="d-flex justify-content-center">Lab Details</h3>
      <table>
        <thead>
          <tr>
          <th>Current Lab</th>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th colSpan="2" style={{textAlign: "center"}}>Options</th>
          </tr>
        </thead>
        {editOption ? "" : labsList.map((lab, index) => {
          return (
            <tbody>
              <tr>
              <td><input type="radio" checked={lab.current_lab == 1}/></td>
                <td><input type="text"  value={lab.lab_id} /></td>
                <td>{lab.lab_name}</td>
                <td>{lab.lab_department}</td>
                <td><button className="btn btn-primary" onClick={()=> setValues({editOption: !editOption})}>{editButton}</button></td>
                <td><button className="btn btn-primary" data-key={index} onClick={clickDelete} >{deleteButton}</button></td>
              </tr>
            </tbody>
          );
        })}
        <tr>
                <td></td>
                <td><input type="text" value={labId} onChange={handleChange("labId")}/></td>
                <td><input type="text" value={labName} onChange={handleChange("labName")}/></td>
                <td><input type="text" value={labDept} onChange={handleChange("labDept")}/></td>
                <td colSpan="2" onClick={clickAdd} style={{textAlign: "center"}}><button  className="btn btn-primary">Add</button></td>
              </tr>
      </table>
     </form>
    )
  }  

  const addNewLabs = () => {
    return(
      
    
    <form >
      <h3 className="d-flex justify-content-center">Lab Details</h3>
      <table>
        <thead>
          <tr>
          <th>Current Lab</th>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th colSpan="2" style={{textAlign: "center"}}>Options</th>
          </tr>
        </thead>
        <tr>
                <td></td>
                <td><input type="text" value={labId} onChange={handleChange("labId")}/></td>
                <td><input type="text" value={labName} onChange={handleChange("labName")}/></td>
                <td><input type="text" value={labDept} onChange={handleChange("labDept")}/></td>
                <td colSpan="2" onClick={clickAdd} style={{textAlign: "center"}}><button  className="btn btn-primary">Add</button></td>
              </tr>
      </table>
     </form>
    )
  }


  return (  
    <Layout>
      <div className="col-md-6 offset-md " >
        <ToastContainer />
        {labsList.length > 0 ?labDetails() : addNewLabs()}
      </div>
    </Layout>
  );
};

export default LabDetails;