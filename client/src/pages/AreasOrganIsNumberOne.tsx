import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Select from "react-select";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { organizationsName } from "../data";

const regionCoordinates: { [key: string]: { lat: number; lng: number } } = {
  "Australasia & Oceania": { lat: -37.808896, lng: 144.950421 },
  "South Asia": { lat: 24.891115, lng: 67.143311 },
  "Middle East & North Africa": { lat: 33.625652, lng: 44.832838 },
  "Central Asia": { lat: 51.811871, lng: 68.35643 },
  "Southeast Asia": { lat: 6.862806, lng: 124.443649 },
  "Eastern Europe": { lat: 43.268167, lng: 46.726483 },
};

const AreasOrganIsNumberOne = () => {
  const [data, setData] = useState<any[]>([]);
  const [orgName, setOrgName] = useState<string>("Unknown");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = organizationsName.map((org) => ({
    value: org,
    label: org,
  }));

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/analysis/relationships/deadliest-regions?orgName=${encodeURIComponent(
          orgName
        )}`
      );
      const fetchedData = response.data.data.response;
      setData(fetchedData);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch data from the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orgName]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "20px" }}>טוען נתונים...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>שגיאה בטעינת הנתונים: {error}</p>;
  }

  if (!loading && data.length === 0) {
    return <p style={{ textAlign: "center" }}>הארגון אינו מוביל באף אחד מהאיזורים "{orgName}".</p>;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        marginTop: "60px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "10px 20px",
          textAlign: "center",
          zIndex: 1000,
          position: "relative",
          backgroundColor: "white",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>בחירת ארגון</h1>
        <div style={{ width: "300px", margin: "0 auto" }}>
          <Select
            options={options}
            defaultValue={{ value: "Unknown", label: "Unknown" }}
            onChange={(selectedOption) =>
              setOrgName(selectedOption ? selectedOption.value : "Unknown")
            }
            placeholder="Select an organization"
            isClearable
            isSearchable
          />
        </div>
      </div>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: "100%", height: "calc(100% - 100px)" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.map((region: any) => {
          const coordinates = regionCoordinates[region.region];
          if (!coordinates) return null;

          return (
            <Marker
              key={region.region}
              position={[coordinates.lat, coordinates.lng]}
              icon={L.icon({
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <strong>Region:</strong> {region.region}
                <br />
                <strong>Top Organization:</strong> {region.topOrg}
                <br />
                <strong>Total Casualties:</strong> {region.totalCasualties}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default AreasOrganIsNumberOne;
