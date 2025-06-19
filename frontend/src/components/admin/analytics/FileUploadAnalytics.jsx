import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2'];

const FileUploadAnalytics = ({ data }) => {
  return (
    <div className="analytics-section">
      <h2>📁 File Upload Analytics</h2>

      <div className="analytics-row">
        <div className="chart-box">
          <h4>Top Uploaders</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topUploaders}>
              <XAxis dataKey="username" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Upload Trends</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.uploadTrends}>
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>File Types</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.fileTypes} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80}>
                {data.fileTypes.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FileUploadAnalytics;
