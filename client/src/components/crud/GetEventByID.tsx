import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GetEventByID = () => {
  const [eventID, setEventID] = useState("");
  const [eventData, setEventData] = useState<any>(null);

  const handleFetchEvent = async () => {
    if (!eventID) {
      toast.error("Please enter an Event ID");
      return;
    }

    setEventData(null); // Reset previous data
    try {
      const response = await axios.get(`https://final-exam-df5g.onrender.com/crud/read/${eventID}`);
      if (response.data && response.data.data.response) {
        setEventData(response.data.data.response);
        toast.success("Event details fetched successfully!");
      } else {
        toast.error("Event not found");
      }
    } catch (error) {
      toast.error("Failed to fetch event details");
    }
  };

  return (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <h3>Get Event by ID</h3>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        <input
          type="text"
          value={eventID}
          onChange={(e) => setEventID(e.target.value)}
          placeholder="Event ID"
          style={{
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "250px",
          }}
        />
        <button
          onClick={handleFetchEvent}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "150px",
          }}
        >
          Fetch Event
        </button>
      </div>
      {eventData && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9",
            display: "inline-block",
            textAlign: "left",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4>Event Details</h4>
          <div style={{ marginBottom: "10px" }}>
            <strong>ID:</strong> {eventData.eventid}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Date:</strong> {`${eventData.iyear}-${eventData.imonth}-${eventData.iday}`}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Country:</strong> {eventData.country_txt}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Region:</strong> {eventData.region_txt}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>City:</strong> {eventData.city}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Latitude:</strong> {eventData.latitude || "N/A"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Longitude:</strong> {eventData.longitude || "N/A"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Attack Type:</strong> {eventData.attacktype1_txt}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Target Type:</strong> {eventData.targtype1_txt}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Target:</strong> {eventData.target1}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Group Name:</strong> {eventData.gname}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Weapon Type:</strong> {eventData.weaptype1_txt}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Kills:</strong> {eventData.nkill || 0}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Wounded:</strong> {eventData.nwound || 0}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Perpetrators:</strong> {eventData.nperps || "N/A"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Summary:</strong> {eventData.summary || "No summary available"}
          </div>
        </div>
      )}
    </div>
  );
};

export default GetEventByID;
