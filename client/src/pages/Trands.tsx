import React, { useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Trends = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [singleYear, setSingleYear] = useState<number | null>(null);

  const fetchData = async (fromYear: number, toYear: number) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/analysis/incident-trends/${fromYear}/${toYear}`
      );

      const data = response.data.data.data;

      const labels = data.map((item: any) => item.year);
      const datasets = data[0]?.attackTypes.map((type: any, index: number) => ({
        label: type.attackType,
        data: data.map(
          (item: any) =>
            item.attackTypes.find(
              (at: any) => at.attackType === type.attackType
            )?.count || 0
        ),
        backgroundColor: `rgba(${(index * 30) % 255}, 150, 200, 0.7)`,
        borderWidth: 1,
      }));

      setChartData({
        labels,
        datasets,
      });
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch data. Please try again.");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = () => {
    if (singleYear !== null) {
      fetchData(singleYear, singleYear);
    } else if (startYear !== null && endYear !== null) {
      fetchData(startYear, endYear);
    } else {
      setError("Please enter either a single year or a range of years.");
    }
  };

  const handleLastYearsSelection = (years: number) => {
    const fromYear = currentYear - years + 1;
    setStartYear(fromYear);
    setEndYear(currentYear);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Incident Trends`,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        paddingTop: "64px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1
        style={{ fontSize: "2rem", marginBottom: "20px", textAlign: "center" }}
      >
        Incident Trends
      </h1>
      <div style={{ width: "80%", maxWidth: "1200px", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <input
            type="number"
            value={startYear || ""}
            onChange={(e) => setStartYear(Number(e.target.value))}
            placeholder="Start Year"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="number"
            value={endYear || ""}
            onChange={(e) => setEndYear(Number(e.target.value))}
            placeholder="End Year"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
          <input
            type="number"
            value={singleYear || ""}
            onChange={(e) => setSingleYear(Number(e.target.value))}
            placeholder="Single Year"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <button
            onClick={() => handleLastYearsSelection(5)}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            5 השנים האחרונות
          </button>
          <button
            onClick={() => handleLastYearsSelection(10)}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            10 השנים האחרונות
          </button>
          <button
            onClick={handleFetchData}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "1rem",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Fetch Data
          </button>
        </div>
      </div>
      {loading && <p>טוען נתונים...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {chartData && (
        <div
          style={{
            width: "100%",
            height: "500px",
            padding: "20px",
          }}
        >
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Trends;
