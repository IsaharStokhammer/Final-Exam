import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { AppDispatch, RootState } from "../store/store";
import { gatAttackTypesPerKind } from "../store/features/analysis/analysis";

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

const AttackTypesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { attackTypesPerKind, status, error } = useSelector(
    (state: RootState) => state.analysis
  );

  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    dispatch(gatAttackTypesPerKind());
  }, [dispatch]);

  useEffect(() => {
    if (attackTypesPerKind && status === "fulfilled") {
      const data = {
        labels: attackTypesPerKind.map((item) => item.attackType),
        datasets: [
          {
            label: "Total Casualties",
            data: attackTypesPerKind.map((item) => item.totalCasualties),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);
    }
  }, [attackTypesPerKind, status]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total Casualties by Attack Type",
      },
    },
    maintainAspectRatio: false, // אפשר לשנות את היחס בין רוחב לגובה
  };

  if (status === "pending") {
    return <p>טוען נתונים...</p>;
  }

  if (status === "rejected") {
    return <p>שגיאה בטעינת הנתונים: {error}</p>;
  }

  if (status === "fulfilled" && (!attackTypesPerKind || attackTypesPerKind.length === 0)) {
    return <p>לא נמצאו נתונים להצגה.</p>;
  }

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
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "20px",
          color: "#333",
          textAlign: "center",
        }}
      >
        Attack Types Data
      </h1>
      {chartData && (
        <div style={{ width: "90%", height: "80%" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default AttackTypesPage;
