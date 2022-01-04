import React from "react";

const EditableRow = ({
  editFormData,
  setEditFormData,
  handleEditFormChange,
  handleCancelClick,
  handleEditFormSubmit,
}) => {
  return (
    <tr>
      <td>
        <input
          type="radio"
          name="currentLab"
          checked={editFormData.currentLab == 1 ? false : true}
          value={editFormData.currentLab}
          onChange={(event) => {
            const fieldName = event.target.getAttribute("name");
            var fieldValue = event.target.value;
            if (fieldName === "currentLab") {
              console.log(fieldValue);
              if (fieldValue) {
                fieldValue = 0;
              } else {
                fieldValue = 1;
              }
            }
            const newFormData = { ...editFormData };
            newFormData[fieldName] = fieldValue;
            console.log(newFormData[fieldName], "sample");
            setEditFormData(newFormData);
          }}
        ></input>
      </td>
      <td>
        <input
          type="text"
          name="labId"
          value={editFormData.labId}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          name="labName"
          value={editFormData.labName}
          onChange={handleEditFormChange}
        ></input>
      </td>
      <td>
        <input
          type="text"
          name="labDept"
          value={editFormData.labDept}
          onChange={handleEditFormChange}
        ></input>
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

export default EditableRow;
