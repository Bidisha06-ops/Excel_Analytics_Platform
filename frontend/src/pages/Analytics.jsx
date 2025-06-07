import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import '../styles/analytics.css';
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
  Filler,
} from 'chart.js';

import { Bar, Line, Pie, Doughnut, Radar } from 'react-chartjs-2';

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
  RadialLinearScale,
  Filler
);

const Analytics = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartType, setChartType] = useState('bar');

  const hasLoggedAnalyze = useRef(false);

  useEffect(() => {
    const fetchRecordAndLogAnalyze = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(`http://localhost:8000/api/records/${id}`, config);
        setRecord(res.data);

        if (res.data.data && res.data.data.length > 0) {
          const keys = Object.keys(res.data.data[0]);
          setColumns(keys);
          setXColumn(keys[0]);
          setYColumn(keys.length > 1 ? keys[1] : keys[0]);
        }

        if (!hasLoggedAnalyze.current) {
          await axios.post(
            `http://localhost:8000/api/activity/analyze/${id}`,
            { filename: res.data.filename || 'unknown file' },
            config
          );
          hasLoggedAnalyze.current = true;
        }
      } catch (error) {
        console.error('Error fetching record or logging analyze activity:', error);
        toast.error('Failed to load record or log activity');
      } finally {
        setLoading(false);
      }
    };

    fetchRecordAndLogAnalyze();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!record) return <p>No record found.</p>;
  if (!record.data || record.data.length === 0) return <p>No data available in Excel.</p>;

  const labels = record.data.map(row => {
    const val = row[xColumn];
    return val !== undefined && val !== null ? val.toString() : 'N/A';
  });

  const dataValues = record.data.map(row => {
    const val = row[yColumn];
    if (typeof val === 'number') return val;
    if (!isNaN(Number(val))) return Number(val);
    return 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: yColumn,
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        fill: chartType === 'line' || chartType === 'radar',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Chart (${chartType.toUpperCase()}) of ${yColumn} vs ${xColumn}`,
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
      case 'radar':
        return <Radar data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="analytics-container">
      <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
        <h2>Analytics for: {record.filename || 'Uploaded File'}</h2>

        <div style={{ marginBottom: 16 }}>
          <label htmlFor="x-column-select">Select X-axis Column: </label>
          <select
            id="x-column-select"
            value={xColumn}
            onChange={e => setXColumn(e.target.value)}
            style={{ marginRight: 16 }}
          >
            {columns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label htmlFor="y-column-select">Select Y-axis Column: </label>
          <select
            id="y-column-select"
            value={yColumn}
            onChange={e => setYColumn(e.target.value)}
            style={{ marginRight: 16 }}
          >
            {columns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>

          <label htmlFor="chart-type-select">Select Chart Type: </label>
          <select
            id="chart-type-select"
            value={chartType}
            onChange={e => setChartType(e.target.value)}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
            <option value="doughnut">Doughnut</option>
            <option value="radar">Radar</option>
          </select>
        </div>
      </div>

      <div className="chart-wrapper">{renderChart()}</div>

      <div className="data-preview">
        <h3>Data Preview (First 5 Rows)</h3>
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {record.data.slice(0, 5).map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col}>
                    {row[col] !== undefined && row[col] !== null
                      ? row[col].toString()
                      : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
