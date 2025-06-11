import React, { useEffect, useState, useRef} from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import '../styles/analytics.css';
import { LineChart, Line as ReLine, ResponsiveContainer, XAxis, YAxis,} from 'recharts';
import { Bar, Line} from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Chart,registerables  } from 'chart.js/auto';


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

  const colorPalette = ['#FF6384', '#36A2EB', '#4CAF50']; // red, blue, green

  const chartData = {
    labels,
    datasets: [
      {
        label: yColumn,
        data: dataValues,
        backgroundColor: labels.map((_, idx) => colorPalette[idx % colorPalette.length]),
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 2,
        fill: chartType === 'line' || chartType === 'radar',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderRadius: chartType === 'bar' ? 8 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Poppins',
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: `Chart (${chartType.toUpperCase()}) of ${yColumn} vs ${xColumn}`,
        color: '#111',
        font: {
          size: 18,
          family: 'Poppins',
          weight: '600',
        },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 10,
        cornerRadius: 4,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#444',
          font: { size: 12 },
        },
        grid: {
          color: '#eee',
          borderDash: [4, 4],
        },
      },
      y: {
        ticks: {
          color: '#444',
          font: { size: 12 },
        },
        grid: {
          color: '#eee',
          borderDash: [4, 4],
        },
      },
    },
  };

const renderChart = () => {
  const commonProps = { data: chartData, options };

  switch (chartType) {
    case 'line':
      return <Line {...commonProps} ref={chartRef} />;

    case 'bar':
      return <Bar {...commonProps} ref={chartRef} />;

    case 'horizontalBar': {
      const horizontalOptions = {
        ...options,
        indexAxis: 'y',
      };
      return <Bar data={chartData} options={horizontalOptions} ref={chartRef} />;
    }

    case 'area': {
      const areaOptions = {
        ...options,
        plugins: {
          ...options.plugins,
        },
        elements: {
          line: { fill: true },
        },
      };
      return <Line data={chartData} options={areaOptions} ref={chartRef} />;
    }

    case 'sparkline': {
      const sparklineData = chartData.datasets[0].data.map((value, index) => ({
        label: labels[index],
        value,
      }));

      return (
        <div style={{ width: '100%', height: 200 }} ref={chartRef}>
          <ResponsiveContainer>
            <LineChart data={sparklineData}>
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <ReLine
                type="monotone"
                dataKey="value"
                stroke="#36A2EB"
                strokeWidth={2}
                dot={{ r: 3 }}
                isAnimationActive={true}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#333',
                  border: 'none',
                  borderRadius: 4,
                  color: '#fff',
                  fontSize: 12,
                  padding: 8,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    default:
      return <Bar {...commonProps} ref={chartRef} />;
  }
};


const downloadAsPNG = async () => {
  let targetNode;

  // Prefer Chart.js canvas if available
  if (chartRef.current?.canvas) {
    targetNode = chartRef.current.canvas;
  } else {
    // Fallback for Recharts (e.g., sparkline)
    targetNode = document.querySelector('.chart-wrapper');
  }

  if (!targetNode) {
    toast.error('Chart not available');
    return;
  }

  try {
    const canvas = await html2canvas(targetNode);
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `chart-${chartType}.png`;
    link.click();
  } catch (err) {
    toast.error('Failed to download PNG');
    console.error('PNG Download Error:', err);
  }
};


Chart.register(...registerables); // Required

const exportAllChartsAsPDF = async () => {
  const pdf = new jsPDF('landscape', 'px', 'a4');
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 30;
  let yOffset = margin;

  const chartTypes = ['bar', 'line', 'horizontalBar'];

  for (const type of chartTypes) {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    await new Promise((resolve) => {
      setTimeout(() => {
        const chart = new Chart(ctx, {
          type: type === 'horizontalBar' ? 'bar' : type,
          data: chartData,
          options: {
            ...options,
            indexAxis: type === 'horizontalBar' ? 'y' : 'x',
            responsive: false,
            animation: false,
            plugins: {
              legend: { display: true },
              title: {
                display: true,
                text: `${type.toUpperCase()} Chart`,
              },
            },
          },
        });

        setTimeout(() => {
          const imageData = canvas.toDataURL('image/png');

          // Check if chart fits on current page
          if (yOffset + 260 > pageHeight - margin) {
            pdf.addPage();
            yOffset = margin;
          }

          pdf.text(type.toUpperCase() + ' Chart', margin, yOffset);
          pdf.addImage(imageData, 'PNG', margin, yOffset + 10, 550, 250);
          chart.destroy();
          yOffset += 280; // space for next chart
          resolve();
        }, 300);
      }, 100);
    });
  }

  // Sparkline export (Recharts)
  const sparklineNode = document.querySelector('#sparkline-container');
  if (sparklineNode) {
    const canvas = await html2canvas(sparklineNode, {
      backgroundColor: '#fff',
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');

    // Add page if needed
    if (yOffset + 160 > pageHeight - margin) {
      pdf.addPage();
      yOffset = margin;
    }

    pdf.text('SPARKLINE', margin, yOffset);
    pdf.addImage(imgData, 'PNG', margin, yOffset + 10, 550, 150);
  }

  pdf.save('all-charts.pdf');
};






return (
  <div className="analytics-container">
    <h2 className="analytics-header">
      <b>Analytics for {record.filename || 'Uploaded File'}</b>
    </h2>

    <div className="chart-section">
      <div className="sidebar-controls">
        <div>
          <label htmlFor="x-column-select">X-axis</label>
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
          <label htmlFor="y-column-select">Y-axis</label>
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

        <div className="download-buttons">
          <button onClick={downloadAsPNG}>Export as PNG</button>
          <button onClick={exportAllChartsAsPDF}>Export All Charts as PDF</button>
        </div>
      </div>

      <div className="chart-display">
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div className="chart-type-toggle">
            {['bar', 'line','horizontalBar','area','sparkline'].map(type => (
              <button
                key={type}
                className={chartType === type ? 'active' : ''}
                onClick={() => setChartType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className={`chart-wrapper ${['pie', 'radar'].includes(chartType) ? 'small' : 'large'}`}>
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  </div>
);


};

export default Analytics;
