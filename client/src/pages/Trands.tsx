import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { colors } from '@mui/material';

const Trands: React.FC = () => {
  const [attacksData, setAttacksData] = useState<any[]>([]);
  const [startYear, setStartYear] = useState<number>(1970);
  const [endYear, setEndYear] = useState<number>(new Date().getFullYear());
  const [specificYear, setSpecificYear] = useState<string>('');
  const [last5Years, setLast5Years] = useState<boolean>(false);
  const [last10Years, setLast10Years] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // חישוב השנים האחרונות בצד הלקוח
      if (last5Years || last10Years) {
        const currentYear = new Date().getFullYear();
        if (last5Years) {
          setStartYear(currentYear - 5);
          setEndYear(currentYear);
        } else if (last10Years) {
          setStartYear(currentYear - 10);
          setEndYear(currentYear);
        }
      }

      // אם לא נבחרו השנים האחרונות, נעדכן לפי טווח שנים או שנה ספציפית
      try {
        const response = await axios.get('http://localhost:3000/api/analysis/incident-trends', {
          params: {
            startYear,
            endYear,
            specificYear,
          },
        });
        setAttacksData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startYear, endYear, specificYear, last5Years, last10Years]);

  const handleSpecificYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpecificYear(value);
    setStartYear(Number(value));  
    setEndYear(Number(value));
  };

  const handleLast5YearsChange = () => {
    setLast5Years(true);
    setLast10Years(false); // כאשר נבחרו 5 שנים האחרונות, לא נבחרות 10
    setSpecificYear(''); // נקה את השנה הספציפית אם נבחרו השנים האחרונות
  };

  const handleLast10YearsChange = () => {
    setLast10Years(true);
    setLast5Years(false); // כאשר נבחרו 10 שנים האחרונות, לא נבחרות 5
    setSpecificYear(''); // נקה את השנה הספציפית אם נבחרו השנים האחרונות
  };

  const chartData = attacksData.map((item: any) => ({
    yearMonth: `${item._id.year}-${item._id.month}`,
    incidents: item.uniqueIncidents,
  }));

  return (
    <div>
      <h2>Attacks by Time</h2>
      
      {/* כפתור ווליום נפרד עבור שנת התחלה */}
      <div>
        <label>Start Year: </label>
        <input 
          type="range"
          min="1970"
          max={new Date().getFullYear()}
          value={startYear}
          onChange={(e) => setStartYear(Number(e.target.value))}
        />
        <span> {startYear}</span>
      </div>

      {/* כפתור ווליום נפרד עבור שנת סיום */}
      <div>
        <label>End Year: </label>
        <input 
          type="range"
          min="1970"
          max={new Date().getFullYear()}
          value={endYear}
          onChange={(e) => setEndYear(Number(e.target.value))}
        />
        <span> {endYear}</span>
      </div>

      {/* שנה ספציפית */}
      <div>
        <label>Specific Year: </label>
        <input
          type="number"
          value={specificYear}
          onChange={handleSpecificYearChange}
        />
      </div>

      {/* 5 שנים אחרונות */}
      <div>
        <label>Last 5 Years: </label>
        <input
          type="checkbox"
          checked={last5Years}
          onChange={handleLast5YearsChange}
        />
      </div>

      {/* 10 שנים אחרונות */}
      <div>
        <label>Last 10 Years: </label>
        <input
          type="checkbox"
          checked={last10Years}
          onChange={handleLast10YearsChange}
        />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} style={{ color: 'rgb(63, 229, 30)', fontSize: '1.5rem' }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="yearMonth" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Trands;
