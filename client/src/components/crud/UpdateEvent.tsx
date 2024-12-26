import { useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormData {
  eventid: string;
  iyear: number;
  imonth: number;
  iday: number;
  country_txt: string;
  region_txt: string;
  city: string;
  latitude: number | null;
  longitude: number | null;
  attacktype1_txt: string;
  targtype1_txt: string;
  target1: string;
  gname: string;
  weaptype1_txt: string;
  nkill: number | string;
  nwound: number | string;
  nperps: number | string;
  summary: string;
}

const UpdateEvent = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [eventID, setEventID] = useState<string>("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleOpenUpdateModal = async () => {
    if (!eventID) {
      setErrorMessage("Please enter an Event ID");
      return;
    }

    try {
      const response = await axios.get(`https://final-exam-df5g.onrender.com/crud/read/${eventID}`);
      setFormData(response.data.data.response);
      setErrorMessage("");
      setUpdateModalOpen(true);
    } catch (error) {
      setErrorMessage("Failed to fetch event details for update");
    }
  };

  const handleUpdateEvent = async () => {
    if (!formData) {
      setErrorMessage("Form data is not loaded.");
      return;
    }

    try {
      const payload = {
        id: formData.eventid,
        data: formData,
      };

      await axios.put("https://final-exam-df5g.onrender.com/crud/update", payload);
      alert("Event updated successfully!");
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("Failed to update event:", error);
      setErrorMessage("Failed to update event");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        if (formData) {
          setFormData({ ...formData, latitude: e.latlng.lat, longitude: e.latlng.lng });
        }
      },
    });

    return formData?.latitude && formData?.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  };

  return (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <h3>Update Event</h3>
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
          }}
        />
        <button
          onClick={handleOpenUpdateModal}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#800080",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Update Event
        </button>
      </div>
      {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}

      {/* Update Modal */}
      <Modal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <Box
          style={{
            width: "90%",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto",
            margin: "auto",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
          }}
        >
          <h2>Update Event</h2>
          {formData ? (
            <>
              <TextField
                label="Event ID"
                fullWidth
                margin="normal"
                value={formData.eventid}
                onChange={(e) => setFormData({ ...formData, eventid: e.target.value })}
              />
              <div style={{ marginBottom: "20px" }}>
                <label>Date:</label>
                <DatePicker
                  selected={
                    formData.iyear && formData.imonth && formData.iday
                      ? new Date(formData.iyear, formData.imonth - 1, formData.iday)
                      : null
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      setFormData({
                        ...formData,
                        iyear: date.getFullYear(),
                        imonth: date.getMonth() + 1,
                        iday: date.getDate(),
                      });
                    }
                  }}
                  dateFormat="yyyy/MM/dd"
                  customInput={<TextField fullWidth />}
                />
              </div>
              <TextField
                label="Country"
                fullWidth
                margin="normal"
                value={formData.country_txt}
                onChange={(e) => setFormData({ ...formData, country_txt: e.target.value })}
              />
              <TextField
                label="Region"
                fullWidth
                margin="normal"
                value={formData.region_txt}
                onChange={(e) => setFormData({ ...formData, region_txt: e.target.value })}
              />
              <TextField
                label="City"
                fullWidth
                margin="normal"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <div style={{ marginBottom: "20px" }}>
                <label>Select Location on Map:</label>
                <MapContainer
                  center={[31.7683, 35.2137]}
                  zoom={8}
                  style={{ height: "300px", width: "100%", marginTop: "10px" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker />
                </MapContainer>
              </div>
              <TextField
                label="Attack Type"
                fullWidth
                margin="normal"
                value={formData.attacktype1_txt}
                onChange={(e) => setFormData({ ...formData, attacktype1_txt: e.target.value })}
              />
              <TextField
                label="Target Type"
                fullWidth
                margin="normal"
                value={formData.targtype1_txt}
                onChange={(e) => setFormData({ ...formData, targtype1_txt: e.target.value })}
              />
              <TextField
                label="Target"
                fullWidth
                margin="normal"
                value={formData.target1}
                onChange={(e) => setFormData({ ...formData, target1: e.target.value })}
              />
              <TextField
                label="Group Name"
                fullWidth
                margin="normal"
                value={formData.gname}
                onChange={(e) => setFormData({ ...formData, gname: e.target.value })}
              />
              <TextField
                label="Weapon Type"
                fullWidth
                margin="normal"
                value={formData.weaptype1_txt}
                onChange={(e) => setFormData({ ...formData, weaptype1_txt: e.target.value })}
              />
              <TextField
                label="Kills"
                fullWidth
                margin="normal"
                value={formData.nkill}
                onChange={(e) => setFormData({ ...formData, nkill: e.target.value })}
              />
              <TextField
                label="Wounded"
                fullWidth
                margin="normal"
                value={formData.nwound}
                onChange={(e) => setFormData({ ...formData, nwound: e.target.value })}
              />
              <TextField
                label="Perpetrators"
                fullWidth
                margin="normal"
                value={formData.nperps}
                onChange={(e) => setFormData({ ...formData, nperps: e.target.value })}
              />
              <TextField
                label="Summary"
                fullWidth
                margin="normal"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleUpdateEvent}>
                Save Changes
              </Button>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateEvent;
