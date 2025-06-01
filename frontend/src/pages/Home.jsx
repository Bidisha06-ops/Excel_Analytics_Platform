import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, FileSpreadsheet, Settings, Download } from 'lucide-react';
import '../styles/home.css';
import Navbar from './Navbar';

function Home() {
  return (
    <>
      <Navbar />

      <main className="home-main">
        <section className="intro-section">
          <h1><b>Excel Analytics Platform</b></h1>
          <p>Upload, visualize, and understand your spreadsheet data like never before.</p>
          <div className="button-group">
            <Link to="/login" className="btn-primary">
              Get Started
            </Link>
            <Link to="/register" className="btn-secondary">
              Register
            </Link>
          </div>
        </section>

        <section className="features-section" aria-label="Features">
          <div className="features-grid">
            <FeatureCard
              icon={<FileSpreadsheet size={40} className="feature-icon" />}
              title="Smart Uploads"
            />
            <FeatureCard
              icon={<BarChart2 size={40} className="feature-icon" />}
              title="Interactive Charts"
            />
            <FeatureCard
              icon={<Settings size={40} className="feature-icon" />}
              title="Custom Filters"
            />
            <FeatureCard
              icon={<Download size={40} className="feature-icon" />}
              title="Export Reports"
            />
          </div>
        </section>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="feature-card">
      <div className="icon-wrapper">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{desc}</p>
    </div>
  );
}

export default Home;
