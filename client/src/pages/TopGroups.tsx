import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Bar } from "react-chartjs-2";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// נתוני האזורים
const regions = [
  {
    latitude: 37.105643,
    longitude: 79.944234,
    name: "East Asia",
    averageCasualties: 12.923940149625935,
  },
  {
    latitude: 21.156762,
    longitude: -86.842448,
    name: "North America",
    averageCasualties: 7.652488425925926,
  },
  {
    latitude: 11.840929,
    longitude: 13.141459,
    name: "Sub-Saharan Africa",
    averageCasualties: 7.477381494986326,
  },
  {
    latitude: 33.625652,
    longitude: 44.832838,
    name: "Middle East & North Africa",
    averageCasualties: 6.97293763372692,
  },
  {
    latitude: 24.891115,
    longitude: 67.143311,
    name: "South Asia",
    averageCasualties: 5.395984346511318,
  },
  {
    latitude: 51.811871,
    longitude: 68.35643,
    name: "Central Asia",
    averageCasualties: 5.344582593250444,
  },
  {
    latitude: 43.268167,
    longitude: 46.726483,
    name: "Eastern Europe",
    averageCasualties: 3.7830482115085537,
  },
  {
    latitude: 13.87358,
    longitude: -90.093913,
    name: "Central America & Caribbean",
    averageCasualties: 3.6445282289249805,
  },
  {
    latitude: 6.862806,
    longitude: 124.443649,
    name: "Southeast Asia",
    averageCasualties: 3.3553295427244336,
  },
  {
    latitude: 1.813128,
    longitude: -78.754227,
    name: "South America",
    averageCasualties: 2.4003056170302455,
  },
  {
    latitude: 52.984404,
    longitude: -7.924562,
    name: "Western Europe",
    averageCasualties: 1.5040567341787368,
  },
  {
    latitude: -37.808896,
    longitude: 144.950421,
    name: "Australasia & Oceania",
    averageCasualties: 1.4539007092198581,
  },
];

const TopGroups = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(5); // ברירת מחדל של לימיט
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const fetchData = async (region: string, limit: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/analysis/relationships/top-groups/${encodeURIComponent(
          region
        )}/?limit=${limit}`
      );
      const data = response.data.data.response;

      // עיבוד הנתונים לגרף
      const chartData = {
        labels: data.map((item: any) => item.groupName),
        datasets: [
          {
            label: "Total Casualties",
            data: data.map((item: any) => item.totalCasualties),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "Total Kills",
            data: data.map((item: any) => item.totalKills),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "Total Wounds",
            data: data.map((item: any) => item.totalWounds),
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartData);
      setError(null);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (region: string) => {
    setSelectedRegion(region);
    fetchData(region, limit);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Top Groups in "${selectedRegion || ""}" (Limit: ${limit})`,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[20, 0]} // מרכז המפה
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {regions.map((region) => (
            <Marker
              key={region.name}
              position={[region.latitude, region.longitude]}
              eventHandlers={{
                click: () => handleMarkerClick(region.name),
              }}
              icon={L.icon({
                iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            >
              <Popup>
                <strong>{region.name}</strong>
                <br />
                Avg Casualties: {region.averageCasualties.toFixed(2)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f5f5f5" }}>
        <h2 style={{ textAlign: "center" }}>Top Groups in {selectedRegion || "Selected Region"}</h2>
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            placeholder="Enter limit"
            style={{
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
              textAlign: "center",
              width: "100px",
            }}
          />
        </div>
        {loading && <p>טוען נתונים...</p>}
        {error && <p>שגיאה בטעינת הנתונים: {error}</p>}
        {!loading && !error && chartData && (
          <div style={{ width: "80%", height: "60%", margin: "0 auto" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopGroups;
