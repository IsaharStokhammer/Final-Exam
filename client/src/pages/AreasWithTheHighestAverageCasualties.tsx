import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { AppDispatch, RootState } from "../store/store";
import { getAreasWithTheHighestAverageCasualties } from "../store/features/analysis/analysis";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIconPng from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/images/marker-shadow.png";

const AreasWithTheHighestAverageCasualties = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { areasWithTheHighestAverageCasualties, status, error } = useSelector(
    (state: RootState) => state.analysis
  );

  useEffect(() => {
    dispatch(getAreasWithTheHighestAverageCasualties());
  }, [dispatch]);

  if (status === "pending") {
    return <p>טוען נתונים למפה...</p>;
  }

  if (status === "rejected") {
    return <p>שגיאה בטעינת נתוני המפה: {error}</p>;
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}> {/* גובה ורוחב מלאים */}
      {status === "fulfilled" && areasWithTheHighestAverageCasualties && (
        <MapContainer
          center={[0, 0]} // מרכז ברירת מחדל
          zoom={2} // זום התחלתי
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {areasWithTheHighestAverageCasualties.map((region, index) => (
            <Marker
              key={index}
              position={[
                region.coordinates.latitude,
                region.coordinates.longitude,
              ]}
              icon={L.icon({
                iconUrl: markerIconPng,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <strong>{region.regionName}</strong>
                <br />
                <em>סוג אזור:</em> {region.regionType}
                <br />
                <em>ממוצע נפגעים:</em> {region.averageCasualties}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      איזורים מסוכנים
    </div>
  );
};

export default AreasWithTheHighestAverageCasualties;
