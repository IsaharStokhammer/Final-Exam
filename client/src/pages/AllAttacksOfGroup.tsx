import { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import { organizationsName } from "../data";

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
  const [selectedOption, setSelectedOption] = useState<any>({
    label: "Hamas (Islamic Resistance Movement)",
    value: "Hamas (Islamic Resistance Movement)",
  });

  // פונקציה לטעינת נתונים
  const fetchData = async (group: string) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://final-exam-df5g.onrender.com/api/analysis/relationships/groups-by-year/2004?group=${encodeURIComponent(group)}`
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
    if (selectedOption?.value.trim()) {
      fetchData(selectedOption.value);
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
        text: `Total Incidents Over Years for "${selectedOption?.label}"`,
      },
    },
    maintainAspectRatio: false,
  };

  // עיבוד נתונים ל-react-select
  const options = organizationsName.map((org) => ({
    label: org,
    value: org,
  }));

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
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
          textAlign: "center",
        }}
      >
        All Attacks of a Group
      </h1>
      <div style={{ width: "50%", marginBottom: "20px" }}>
        <Select
          options={options}
          value={selectedOption}
          onChange={(option) => setSelectedOption(option)}
          placeholder="Select a group..."
          isClearable
        />
      </div>
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
          marginBottom: "20px",
        }}
      >
        Search
      </button>
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
