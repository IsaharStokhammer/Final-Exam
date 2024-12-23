import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AllAttacksOfGroup = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupName, setGroupName] = useState<string>("Ulster Freedom Fighters (UFF)"); // שם הארגון המתחלתי

  // פונקציה לטעינת נתונים
  const fetchData = async (group: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/analysis/relationships/groups-by-year/2004?group=${encodeURIComponent(group)}`
      );
      const data = response.data.data.data;

      // עיבוד הנתונים לגרף
      const chartData = {
        labels: data.map((item: any) => item.year), // השנים על ציר ה-X
        datasets: [
          {
            label: "Total Incidents",
            data: data.map((item: any) => item.totalIncidents), // מספר האירועים על ציר ה-Y
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.1,
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

  // קריאה ל-API כאשר המשתמש מבצע חיפוש
  const handleSearch = () => {
    if (groupName.trim()) {
      fetchData(groupName);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Total Incidents Over Years for "${groupName}"`,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
          textAlign: "center",
        }}
      >
        All Events of a Group
      </h1>
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
          style={{
            padding: "10px",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "5px",
            textAlign: "center",
            width: "300px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
      {loading && <p>טוען נתונים...</p>}
      {error && <p>שגיאה בטעינת הנתונים: {error}</p>}
      {!loading && !error && chartData && (
        <div style={{ width: "80%", height: "60%" }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default AllAttacksOfGroup;

