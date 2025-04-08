import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Navbar from "../Navbar/Navbar.jsx";
const Home = () => {
  return (
    <>
      <Navbar/>

    <div className="home-container">
      <h1>Welcome to AirBridge</h1>
      


      <div className="description">
        <p>
          AirBridge is a smart file-sharing platform built to seamlessly transfer files, text, and links between devices such as laptops and mobiles. 
          Whether you're in a classroom, office, or working remotely, AirBridge allows you to quickly upload your data and access it from any device via a 
          unique code or QR scanner.
        </p>

        <h2>Key Features</h2>
        <ul>
          <li>Upload and share <strong>multiple files</strong> (documents, PDFs, images, music, videos, APKs, PPTs, etc.) across devices.</li>
          <li>Share <strong>text</strong> notes or snippets without needing a third-party tool.</li>
          <li>Send and open <strong>web links</strong> easily across devices.</li>
          <li>Supports file uploads using a unique <strong>Session ID</strong> for better organization.</li>
          <li><strong>Scan QR codes</strong> to instantly open the shared content on your mobile device.</li>
          <li>Download all uploaded content grouped under the session for convenient access.</li>
          <li>Optimized for both desktop and mobile experiences.</li>
        </ul>

        <div className="home-links">
          <Link to="/upload" className="home-button">Upload Files / Text / Link</Link>
          <Link to="/download" className="home-button">Download using Code / QR</Link>
        </div>
      </div>
    </div>
        </>
  );
};

export default Home;