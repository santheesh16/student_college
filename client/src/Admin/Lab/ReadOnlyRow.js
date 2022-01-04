import React from "react";

const ReadOnlyRow = ({ contact, handleEditClick, handleDeleteClick }) => {
  return (
    <tr>
      <td>
        <input type="radio" checked={contact.current_lab == 1} />
      </td>
      <td>{contact.lab_id}</td>
      <td>{contact.lab_name}</td>
      <td>{contact.lab_department}</td>
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
          onClick={(event) => handleDeleteClick(event, contact.lab_id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
