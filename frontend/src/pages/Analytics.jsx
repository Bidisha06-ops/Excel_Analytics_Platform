import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import '../styles/analytics.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const chartRef = useRef(null);
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
          hasLoggedAnalyze.current = true;
          await axios.post(
            `http://localhost:8000/api/activity/analyze/${id}`,
            { filename: res.data.filename || 'unknown file' },
            config
          );
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
      backgroundColor: 'rgba(54, 162, 235, 0.6)', // just one color
      borderColor: 'rgba(0, 0, 0, 0.1)',
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
    const commonProps = { data: chartData, options };
    switch (chartType) {
      case 'line':
        return <Line {...commonProps} ref={chartRef} />;
      case 'pie':
        return <Pie {...commonProps} ref={chartRef} />;
      case 'doughnut':
        return <Doughnut {...commonProps} ref={chartRef} />;
      case 'radar':
        return <Radar {...commonProps} ref={chartRef} />;
      case 'bar':
      default:
        return <Bar {...commonProps} ref={chartRef} />;
    }
  };

  const downloadAsPNG = () => {
    const chartInstance = chartRef.current;
    if (!chartInstance || !chartInstance.canvas) {
      toast.error('Chart not available');
      return;
    }

    const link = document.createElement('a');
    link.href = chartInstance.canvas.toDataURL('image/png');
    link.download = `chart-${chartType}.png`;
    link.click();
  };

  const downloadAsPDF = async () => {
    const chartInstance = chartRef.current;
    if (!chartInstance || !chartInstance.canvas) {
      toast.error('Chart not available');
      return;
    }

    const canvas = await html2canvas(chartInstance.canvas);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`chart-${chartType}.pdf`);
  };


return (
  <div className="analytics-container">
    <h2 className="analytics-header">
      Analytics for: {record.filename || 'Uploaded File'}
    </h2>

    <div className="analytics-body">
      <div className="sidebar-controls">
        <div>
          <label htmlFor="x-column-select">X-Axis:</label>
          <select
            id="x-column-select"
            value={xColumn}
            onChange={e => setXColumn(e.target.value)}
          >
            {columns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="y-column-select">Y-Axis:</label>
          <select
            id="y-column-select"
            value={yColumn}
            onChange={e => setYColumn(e.target.value)}
          >
            {columns.map(col => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="chart-type-select">Chart Type:</label>
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

        <div className="download-buttons">
          <button onClick={downloadAsPNG}>Download as PNG</button>
          <button onClick={downloadAsPDF}>Download as PDF</button>
        </div>
      </div>

      <div className="chart-display">
        {renderChart()}
      </div>
    </div>

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
