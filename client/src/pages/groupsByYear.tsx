import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

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

const GroupsByYear = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2004");

  const fetchData = async (year: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/analysis/relationships/groups-by-year/${year}`
      );
      const data = response.data.data.data;

      const chartData = {
        labels: data.map((item: any) => item.groupName),
        datasets: [
          {
            label: "Total Incidents",
            data: data.map((item: any) => item.totalIncidents),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };

      setChartData(chartData);
    } catch (error: any) {
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear.length === 4 && !isNaN(Number(selectedYear))) {
      fetchData(selectedYear);
    }
  }, [selectedYear]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Total Incidents by Groups (${selectedYear})`,
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return <p>טוען נתונים...</p>;
  }

  if (error) {
    return <p>שגיאה בטעינת הנתונים: {error}</p>;
  }

  if (!chartData) {
    return <p>לא נמצאו נתונים להצגה.</p>;
  }

  return (
    <div
      style={{
        width: "100vw",
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
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
          textAlign: "center",
        }}
      >
        מתקפות בשנת {selectedYear}
      </h1>

      <input
        type="number"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        placeholder="Enter a year"
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "5px",
          textAlign: "center",
          width: "150px",
        }}
      />
      <div style={{ width: "100%", height: "70%" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default GroupsByYear;
