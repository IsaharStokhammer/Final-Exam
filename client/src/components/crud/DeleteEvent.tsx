import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteEvent = () => {
  const [deleteId, setDeleteId] = useState("");
  
  const handleDeleteEvent = async () => {
    if (!deleteId) {
      toast.error("Please enter an Event ID");
      return;
    }
    try {
      const response = await axios.delete(`http://localhost:3000/crud/delete/${deleteId}`);
      toast.success(`Event with ID ${deleteId} deleted successfully!`);
      setDeleteId(""); // Reset input
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <h3>Delete Event</h3>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
        <TextField
          label="Event ID for Delete"
          value={deleteId}
          onChange={(e) => setDeleteId(e.target.value)}
          style={{ width: "250px" }}
        />
        <Button variant="contained" color="error" onClick={handleDeleteEvent} style={{ width: "150px" }}>
          Delete Event
        </Button>
      </div>
    </div>
  );
};

export default DeleteEvent;
