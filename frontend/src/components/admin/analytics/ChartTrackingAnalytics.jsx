import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const PIE_COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#845EC2'];
const BAR_COLORS = ['#8884d8', '#FF8042', '#00C49F', '#FFBB28', '#FF6666'];

const truncate = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const ChartTrackingAnalytics = ({ data }) => {
  const mostViewed = data.viewedChartTypes?.[0]?._id || 'N/A';

  return (
    <div className="analytics-section">
      <h2>📈 Chart Tracking</h2>

      {/* Summary Cards */}
      <div className="summary-boxes" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="summary-card">📁 Total Analyzed Files: <strong>{data.topAnalyzedFiles?.length || 0}</strong></div>
        <div className="summary-card">🏆 Most Viewed Chart: <strong>{mostViewed}</strong></div>
      </div>

      <div className="analytics-row">
        {/* Viewed Chart Types */}
        <div className="chart-box">
          <h4>Viewed Chart Types</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data.viewedChartTypes}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.viewedChartTypes.map((entry, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Analyzed Files */}
        <div className="chart-box">
          <h4>Top Analyzed Files</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topAnalyzedFiles}>
              <XAxis
                dataKey="filename"
                tickFormatter={(name) => truncate(name, 10)}
                interval={0}
              />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Analysis Count']} />
              <Bar dataKey="count">
                {data.topAnalyzedFiles.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Analysis Hours */}
      <div className="analytics-row">
        <div className="chart-box" style={{ width: '100%' }}>
          <h4>Peak Analysis Hours</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.peakAnalysisHours}>
              <XAxis
                dataKey="_id"
                label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual User Analyzed Records */}
      <div className="chart-box" style={{ marginTop: '2rem', width: '100%' }}>
        <h4>Analyzed Records by Users</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Username</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Analyzed Records</th>
            </tr>
          </thead>
          <tbody>
            {data.userAnalysisStats?.map((user, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.username}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{user.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChartTrackingAnalytics;
