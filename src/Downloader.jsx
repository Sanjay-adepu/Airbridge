import React, { useState } from 'react';
import QrScanner from './QrScanner';
import './Downloader.css';
import Navbar from "./Navbar/Navbar.jsx";
const Downloader = () => {
  const [code, setCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleDownload = () => {
    if (!code) return alert("Please enter or scan a code");
    window.open(`https://airbridge-backend.onrender.com/download/${code}`, '_blank');
  };

  return (
    <>
      <Navbar/>

    <div className="downloader-container">
      <h2 className="title">Download Your File</h2>
      <p className="description">
        Enter your unique file code or scan the QR code to download the file directly.
      </p>

      <input
        type="text"
        placeholder="Enter Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="input-box"
      />

      <div className="button-group">
        <button className="download-btn" onClick={handleDownload}>Download</button>
        <button className="scan-btn" onClick={() => setShowScanner(!showScanner)}>
          {showScanner ? 'Close Scanner' : 'Scan QR Code'}
        </button>
      </div>

{showScanner && (
  <div className="scanner-wrapper">
    <QrScanner onScan={(result) => {
      const extracted = result.split('/').pop();
      setCode(extracted);
      setShowScanner(false);
      window.open(`https://airbridge-backend.onrender.com/download/${extracted}`, '_blank');
    }} />
  </div>
)}
    </div>
        </>
  );
};

export default Downloader;