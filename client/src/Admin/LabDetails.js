import React, { useState, useEffect, Fragment } from "react";
import Layout from "../components/Navbar";
import axios from "axios";
import { getCookie, signout, setLocalStorage } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import ReadOnlyRow from "./Lab/ReadOnlyRow";
import EditableRow from "./Lab/EditableRow";
import ".././App.css"

const LabDetails = ({ history }) => {
  const [contacts, setContacts] = useState([]);
  const [addFormData, setAddFormData] = useState({
    labId: "",
    labName: "",
    labDept: "",
  });

  const [editFormData, setEditFormData] = useState({
    labId: "",
    labName: "",
    labDept: "",
    currentLab: ""
  });

  const [editContactId, setEditContactId] = useState(null);

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  useEffect(() => {
    loadBlock();
  }, []);

  const loadBlock = () => {
    axios({
      method: "GET",
      url: "http://localhost:8000/api/lab/load-details/all",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response.data);
        setLocalStorage("labs", response.data);
        setContacts(...contacts, response.data)
        
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

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:8000/api/lab/add",
      data: {
        labId: addFormData.labId,
        labName: addFormData.labName,
        labDept: addFormData.labDept,
      }
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        toast.success(response.data.message);
        loadBlock();
        window.location.reload();
      })
      .catch((error) => {
        console.log("ADDLAB ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  };

  
  const handleEditFormSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "PUT",
      url: `http://localhost:8000/api/lab/update`,
      data: {
        labId: editFormData.labId,
        labName: editFormData.labName,
        labDept: editFormData.labDept,
        currentLab: editFormData.currentLab
      }
    })
      .then((response) => {
        console.log("UPDATE LAB SUCCESS", response);
        loadBlock();
        toast.success(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.log("UPDATE LAB ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  }

  const clickDelete = (event, lab_id) => {
    event.preventDefault();
    axios({
      method: "DELETE",
      url: `http://localhost:8000/api/lab/delete/${lab_id}`,
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        toast.success(response.data.message);
        loadBlock();
        window.location.reload();
      })
      .catch((error) => {
        console.log("ADDLAB ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  };

  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    var fieldValue = event.target.value;
    if(fieldName === "currentLab"){
      console.log(fieldValue)
      if(fieldValue == 0){
        fieldValue = 1;
      }else{
        fieldValue = 0;
      }
    }
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    console.log(newFormData[fieldName], 'sample');
    setEditFormData(newFormData);

  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.lab_id);
    const formValues = {
      labId: contact.lab_id,
      labName: contact.lab_name,
      labDept: contact.lab_department,
      currentLab: contact.current_lab,
    };
    setEditFormData(formValues);
  };

  const handleDeleteClick = (event ,contactId) => {
    const index = contacts.findIndex((contact) => contact.lab_id === contactId);
    clickDelete(event ,index+1);
  };

  const labDetails = () => {
    return (
      <form onSubmit={handleEditFormSubmit}>
        <h3 className="text-center">Lab Details</h3>
        <table>
          <thead>
            <tr>
              <th>Current Lab</th>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th colSpan="2" style={{ textAlign: "center" }}>
                Options
              </th>
            </tr>
          </thead>
          {contacts.map((contact) => (
            <Fragment>
              {editContactId == contact.lab_id ? (
                <EditableRow
                  editFormData={editFormData}
                  setEditFormData={setEditFormData}
                  handleEditFormChange={handleEditFormChange}
                  handleCancelClick={handleCancelClick}
                  handleEditFormSubmit={handleEditFormSubmit}
                />
              ) : (
                <ReadOnlyRow
                  contact={contact}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                />
              )}
            </Fragment>
          ))}
          <tr>
            <td></td>
            <td>
              <input
                type="text"
                name="labId"
                onChange={handleAddFormChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="labName"
                onChange={handleAddFormChange}
              />
            </td>
            <td>
              <input
                type="text"
                name="labDept"
                onChange={handleAddFormChange}
              />
            </td>
            <td
              colSpan="2"
              onClick={handleAddFormSubmit}
              style={{ textAlign: "center" }}>
              <button className="btn btn-primary">Add</button>
            </td>
          </tr>
        </table>
      </form>
    );
  };

  const addNewLabs = () => {
    return (
      <form>
        <h3 className="d-flex justify-content-center">Lab Details</h3>
        <table>
          <thead>
            <tr>
              <th>Current Lab</th>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th colSpan="2" style={{ textAlign: "center" }}>
                Acion
              </th>
            </tr>
          </thead>
          <tr>
            <td></td>
            <td>
              <input
                type="text"
                required
                name="labId"
                onChange={handleAddFormChange}
              />
            </td>
            <td>
              <input
                type="text"
                required
                name="labName"
                onChange={handleAddFormChange}
              />
            </td>
            <td>
              <input
                type="text"
                required
                name="labDept"
                onChange={handleAddFormChange}
              />
            </td>
            <td
              colSpan="2"
              onClick={handleAddFormSubmit}
              style={{ textAlign: "center" }}
            >
              <button className="btn btn-primary">Add</button>
            </td>
          </tr>
        </table>
      </form>
    );
  };

  return (
    <Layout>
      <div className="lab-details">
        <ToastContainer />
        
        {contacts.length > 0 ? labDetails() :  addNewLabs()}
      </div>
    </Layout>
  );
};

export default LabDetails;
