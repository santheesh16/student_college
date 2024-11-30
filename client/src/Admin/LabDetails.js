import React, { useState, useEffect, Fragment } from "react";
import Layout from "../components/Navbar";
import axios from "axios";
import { getCookie, signout, setLocalStorage } from "../auth/helpers";
import { ToastContainer, toast } from "react-toastify";
import "../../node_modules/react-toastify/dist/ReactToastify.min.css";
import ".././App.css";

const LabDetails = ({ history }) => {
  
  const [contacts, setContacts] = useState([]);
  const [addFormData, setAddFormData] = useState({
    labId: "",
    labName: "",
    labDept: "",
    currentLab: Boolean(),
  });

  const [editFormData, setEditFormData] = useState({
    labId: "",
    labName: "",
    labDept: "",
    currentLab: Boolean(),
  });
  const { currentLab } = editFormData;

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

  function loadBlock() {
    axios({
      method: "POST",
      url: "/api/lab/load-details/all",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((response) => {
        console.log("PRIVATE PROFILE UPDATE", response.data);
        setLocalStorage("labs", response.data);
        let labsData = response.data;
        let labsArray = [];

        for (let index = 0; index < labsData.length; index++) {
          let lab = {
            labId: labsData[index].lab_id,
            labName: labsData[index].lab_name,
            labDept: labsData[index].lab_department,
            currentLab: Boolean(labsData[index].current_lab),
          };
          labsArray.push(lab);
        }
        setContacts(...contacts, labsArray);
      })
      .catch((error) => {
        console.log("PRIVATE PROFILE UPDATE ERROR", error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push("/");
          });
        }
      });
  }

  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: "/api/lab/add",
      data: {
        labId: addFormData.labId,
        labName: addFormData.labName,
        labDept: addFormData.labDept,
        currentLab: addFormData.currentLab,
      },
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        window.location.reload(false);
        toast.success(response.data.message);
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
      url: `/api/lab/update`,
      data: {
        labId: editFormData.labId,
        labName: editFormData.labName,
        labDept: editFormData.labDept,
        currentLab: editFormData.currentLab,
      },
    })
      .then((response) => {
        console.log("UPDATE LAB SUCCESS", response);
        window.location.reload(false);
        toast.success(response.data.message);
        
      })
      .catch((error) => {
        console.log("UPDATE LAB ERROR", error.response.data);
        toast.error(error.response.data.error);
      });
  };

  const clickDelete = (event, labId) => {
    event.preventDefault();
    axios({
      method: "DELETE",
      url: `/api/lab/delete/${labId}`,
    })
      .then((response) => {
        console.log("ADDLAB SUCCESS", response);
        window.location.reload(false);
        toast.success(response.data.message);
        
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

    console.log(fieldName, fieldValue);
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };

  const handleCancelClick = () => {
    setEditContactId(null);
  };

  const handleEditClick = (event, contact) => {
    event.preventDefault();
    setEditContactId(contact.labId);
    const formValues = {
      labId: contact.labId,
      labName: contact.labName,
      labDept: contact.labDept,
      currentLab: contact.currentLab,
    };
    setEditFormData(formValues);
  };

  const handleDeleteClick = (event, contactId) => {
    const index = contacts.findIndex((contact) => contact.labId === contactId);
    clickDelete(event, index + 1);
  };

  const editTableRow = (editFormData) => {
    return (
      <tr>
        <td>
          <input
            type="radio"
            name="currentLab"
            value={editFormData.currentLab}
            onChange={() =>
              setEditFormData({
                ...editFormData,
                currentLab: !editFormData.currentLab,
              })
            }
            checked={currentLab}
          />
        </td>
        <td>
          <input
            type="text"
            name="labId"
            value={editFormData.labId}
            onChange={handleEditFormChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="labName"
            value={editFormData.labName}
            onChange={handleEditFormChange}
          />
        </td>
        <td>
          <input
            type="text"
            name="labDept"
            value={editFormData.labDept}
            onChange={handleEditFormChange}
          />
        </td>
        <td>
          <button
            className="btn btn-primary"
            onClick={handleEditFormSubmit}
            type="submit"
          >
            Save
          </button>
        </td>
        <td>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleCancelClick}
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  };

  const readOnlyRow = (contact) => {
    return (
      <tr>
        <td>
          <input type="radio" checked={contact.currentLab} />
        </td>
        <td>{contact.labId}</td>
        <td>{contact.labName}</td>
        <td>{contact.labDept}</td>
        <td>
          <button
            className="btn btn-primary"
            type="button"
            onClick={(event) => handleEditClick(event, contact)}
          >
            Edit
          </button>
        </td>
        <td>
          <button
            className="btn btn-primary"
            type="button"
            onClick={(event) => handleDeleteClick(event, contact.labId)}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  const labDetails = () => {
    return (
      <form onSubmit={handleEditFormSubmit}>
        <h3 className="text-center">Lab Details</h3>
        <table>
          <thead>
            <tr>
              <th>Current Section</th>
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
              {editContactId === contact.labId
                ? editTableRow(editFormData)
                : readOnlyRow(contact)}
            </Fragment>
          ))}
          <tr>
            <td></td>
            <td>
              <input type="text" name="labId" onChange={handleAddFormChange} />
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
              style={{ textAlign: "center" }}
            >
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
              <th>Current Section</th>
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
              onClick={() => {
                handleAddFormSubmit();
                loadBlock();
              }}
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

        {contacts.length === 0 ?  addNewLabs() : labDetails()}
      </div>
    </Layout>
  );
};

export default LabDetails;
