import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ChartTrackingAnalytics = ({ data }) => {
  return (
    <div className="analytics-section">
      <h2>📈 Chart Tracking</h2>

      <div className="analytics-row">
        <div className="chart-box">
          <h4>Viewed Chart Types</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data.viewedChartTypes} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80}>
                {data.viewedChartTypes.map((entry, index) => (
                  <Cell key={index} fill={['#FF8042', '#00C49F', '#FFBB28', '#0088FE', '#845EC2'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Top Analyzed Files</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topAnalyzedFiles}>
              <XAxis dataKey="filename" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Peak Analysis Hours</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.peakAnalysisHours}>
              <XAxis dataKey="_id" label={{ value: 'Hour', position: 'insideBottomRight', offset: -5 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartTrackingAnalytics;
