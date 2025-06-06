import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js';

import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
);

const Analytics = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [columns, setColumns] = useState([]);
  const [chartType, setChartType] = useState('bar'); // default to bar


  useEffect(() => {
  const fetchRecord = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.get(`http://localhost:8000/api/records/${id}`, config);
      setRecord(res.data);

      if (res.data.data && res.data.data.length > 0) {
        const keys = Object.keys(res.data.data[0]);
        setColumns(keys);
        setSelectedColumn(keys[0]);
      }

      // Always attempt to log - backend prevents duplicates
      await axios.post(
        `http://localhost:8000/api/activity/analyze/${id}`,
        { filename: res.data.filename || 'unknown file' },
        config
      );

    } catch (error) {
      console.error('Error fetching record or logging analyze activity:', error);
      toast.error('Failed to load record or log activity');
    } finally {
      setLoading(false);
    }
  };

  fetchRecord();
}, [id]);

  if (loading) return <p>Loading...</p>;
  if (!record) return <p>No record found.</p>;
  if (!record.data || record.data.length === 0) return <p>No data available in Excel.</p>;

  const labels = record.data.map((row, idx) => `Row ${idx + 1}`);

  const dataValues = record.data.map((row) => {
    const val = row[selectedColumn];
    if (typeof val === 'number') return val;
    if (!isNaN(Number(val))) return Number(val);
    return 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: selectedColumn,
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `${chartType.toUpperCase()} Chart of ${selectedColumn}`,
      },
    },
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', padding: '20px' }}>
      <h2>Analytics for: {record.filename || 'Uploaded File'}</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="column-select">Select Column: </label>
        <select
          id="column-select"
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          {columns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <label htmlFor="chart-select">Chart Type: </label>
        <select
          id="chart-select"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="pie">Pie</option>
          <option value="doughnut">Doughnut</option>
        </select>
      </div>

      {renderChart()}

      <div style={{ marginTop: '30px' }}>
        <h3>Raw Data Preview (First 5 Rows)</h3>
        <pre style={{ backgroundColor: '#eee', padding: '10px', overflowX: 'auto' }}>
          {JSON.stringify(record.data.slice(0, 5), null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Analytics;
