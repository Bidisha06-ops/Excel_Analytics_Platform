import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { BarChart2, FileSpreadsheet, Settings } from 'lucide-react';
import Footer from './Footer';

function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <section className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#217346] mb-4">
            Empower Your Data with Excel Analytics
          </h1>
          <p className="text-gray-700 text-lg mb-8">
            Upload, visualize, and understand your spreadsheet data like never before.
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/login">
              <button className="bg-[#217346] hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-md">
                Get Started
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-white border border-[#217346] hover:bg-[#217346] hover:text-white text-[#217346] font-semibold px-6 py-3 rounded-xl transition shadow-md">
                Register
              </button>
            </Link>
          </div>
        </section>

        <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<FileSpreadsheet size={40} className="text-[#217346]" />}
            title="Smart Uploads"
            desc="Easily upload Excel or CSV files and get instant insights."
          />
          <FeatureCard
            icon={<BarChart2 size={40} className="text-[#217346]" />}
            title="Interactive Charts"
            desc="Visualize your data with bar, pie, and line charts."
          />
          <FeatureCard
            icon={<Settings size={40} className="text-[#217346]" />}
            title="Custom Filters"
            desc="Apply dynamic filters and drill down into key metrics."
          />
        </section>
      </main>
      <Footer/>
    </>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <Link to="/login" className="transform hover:scale-[1.02] transition duration-200">
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg text-center cursor-pointer h-full">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-bold text-[#217346] mb-2">{title}</h3>
        <p className="text-gray-600">{desc}</p>
      </div>
    </Link>
  );
}

export default Home;
