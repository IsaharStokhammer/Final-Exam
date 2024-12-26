import React, { useState } from "react";
import axios from "axios";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TerrorEvent {
  eventid: string;
  date: Date;
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
  nkill: number;
  nwound: number;
  nperps: number;
  summary: string;
}

const CreateEvent: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<TerrorEvent>({
    eventid: "",
    date: new Date(),
    country_txt: "",
    region_txt: "",
    city: "",
    latitude: null,
    longitude: null,
    attacktype1_txt: "",
    targtype1_txt: "",
    target1: "",
    gname: "",
    weaptype1_txt: "",
    nkill: 0,
    nwound: 0,
    nperps: 0,
    summary: "",
  });

  const handleCreateEvent = async () => {
    try {
      const { date, ...rest } = formData;
      if (!date) {
        toast.error("Please select a valid date.");
        return;
      }
      const [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
      const finalData = { ...rest, iyear: year, imonth: month, iday: day };

      await axios.post("https://final-exam-df5g.onrender.com/crud/create", finalData);
      setCreateModalOpen(false);
      setFormData({
        eventid: "",
        date: new Date(),
        country_txt: "",
        region_txt: "",
        city: "",
        latitude: null,
        longitude: null,
        attacktype1_txt: "",
        targtype1_txt: "",
        target1: "",
        gname: "",
        weaptype1_txt: "",
        nkill: 0,
        nwound: 0,
        nperps: 0,
        summary: "",
      });
      toast.success("Event created successfully!");
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const LocationMarker: React.FC = () => {
    useMapEvents({
      click(e) {
        setFormData((prev) => ({
          ...prev,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        }));
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} />
    ) : null;
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCreateModalOpen(true)}
        style={{ marginBottom: "10px", width: "250px" }}
      >
        Create New Event
      </Button>

      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)}>
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
          <h2>Create Event</h2>
          <TextField
            label="Event ID"
            fullWidth
            margin="normal"
            value={formData.eventid}
            onChange={(e) => setFormData({ ...formData, eventid: e.target.value })}
            style={{ marginBottom: "20px" }}
          />
          <div style={{ marginBottom: "20px" }}>
            <label>Date:</label>
            <DatePicker
              selected={formData.date}
              onChange={(date: Date | null) => {
                if (date) {
                  setFormData({ ...formData, date });
                } else {
                  toast.error("Invalid date selected");
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
            type="number"
            value={formData.nkill}
            onChange={(e) => setFormData({ ...formData, nkill: Number(e.target.value) })}
          />
          <TextField
            label="Wounded"
            fullWidth
            margin="normal"
            type="number"
            value={formData.nwound}
            onChange={(e) => setFormData({ ...formData, nwound: Number(e.target.value) })}
          />
          <TextField
            label="Perpetrators"
            fullWidth
            margin="normal"
            type="number"
            value={formData.nperps}
            onChange={(e) => setFormData({ ...formData, nperps: Number(e.target.value) })}
          />
          <TextField
            label="Summary"
            fullWidth
            margin="normal"
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateEvent}
            style={{ marginTop: "20px" }}
          >
            Save Event
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateEvent;
