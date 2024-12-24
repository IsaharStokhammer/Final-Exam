import React, { useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateEvent = () => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [eventID, setEventID] = useState("");
  const [formData, setFormData] = useState<any>(null);

  const handleOpenUpdateModal = async () => {
    if (!eventID) {
      toast.error("Please enter an Event ID");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/crud/read/${eventID}`);
      setFormData(response.data.data.response);
      toast.success("Event details loaded successfully!");
      setUpdateModalOpen(true);
    } catch (error) {
      toast.error("Failed to fetch event details for update");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const payload = {
        id: formData.eventid,
        data: formData,
      };

      await axios.put("http://localhost:3000/crud/update", payload);
      toast.success("Event updated successfully!");
      setUpdateModalOpen(false);
    } catch (error) {
      console.error("Failed to update event:", error);
      toast.error("Failed to update event");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setFormData({ ...formData, latitude: e.latlng.lat, longitude: e.latlng.lng });
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
        <TextField
          type="text"
          value={eventID}
          onChange={(e) => setEventID(e.target.value)}
          placeholder="Event ID"
          variant="outlined"
          style={{ width: "250px" }}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleOpenUpdateModal}
          style={{ width: "150px" }}
        >
          Update Event
        </Button>
      </div>

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
                  selected={new Date(formData.iyear, formData.imonth - 1, formData.iday)}
                  onChange={(date: Date) =>
                    setFormData({
                      ...formData,
                      iyear: date.getFullYear(),
                      imonth: date.getMonth() + 1,
                      iday: date.getDate(),
                    })
                  }
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUpdateEvent}
                style={{ marginTop: "20px" }}
              >
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
