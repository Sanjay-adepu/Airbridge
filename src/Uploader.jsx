import React, { useState } from 'react';
import './Upload.css';
import Navbar from "./Navbar/Navbar.jsx";
import axios from 'axios';

const UPLOADTHING_TOKEN = 'eyJhcGlLZXkiOiJza19saXZlXzY3Nzc0NDMyZmI4YmY4ZWRiODdkMTYwZGMzZGY5ZTRhNGM5ZjA3OGI4MzRkNjgwZjMyMmJjOWE2MTIwMzJmM2UiLCJhcHBJZCI6InJnMDdnbmtrbzYiLCJyZWdpb25zIjpbInNlYTEiXX0=';

const UploadInterface = () => {
  const [selectedType, setSelectedType] = useState('files');
  const [fileInputMode, setFileInputMode] = useState('files');
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();

    const sessionData = {
      files: [],
      text: '',
      link: '',
    };

    try {
      setUploading(true);

      if (selectedType === 'files') {
        if (files.length === 0) return alert("Please select at least one file.");

        for (const file of files) {
          const uploadRes = await fetch("https://uploadthing.com/api/uploadFiles", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${UPLOADTHING_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              files: [{ name: file.name, size: file.size, type: file.type }],
            }),
          });

          const uploadJson = await uploadRes.json();
          const { url, key } = uploadJson[0];

          await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });

          sessionData.files.push({
            url: url.split("?")[0], // remove query params
            name: file.name,
            type: file.type,
          });
        }

      } else if (selectedType === 'text') {
        if (!text.trim()) return alert("Please enter some text.");
        sessionData.text = text.trim();
      } else if (selectedType === 'link') {
        if (!link.trim()) return alert("Please enter a link.");
        sessionData.link = link.trim();
      }

      // Send to backend
      const backendRes = await axios.post('https://airbridge-backend.vercel.app/upload', sessionData, {
        headers: { 'Content-Type': 'application/json' }
      });

      setCode(backendRes.data.code);

      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${backendRes.data.code}`);
      setQrImage(qrRes.data.qr);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <div className="instructions">
          <h2>Upload to AirBridge</h2>
          <p>Select <strong>Files</strong>, <strong>Text</strong>, or <strong>Link</strong> to share.</p>
        </div>

        <div className="option-container">
          {['files', 'text', 'link'].map(type => (
            <button key={type}
              onClick={() => setSelectedType(type)}
              className={`option-btn ${selectedType === type ? 'active' : ''}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="dynamic-field">
          {selectedType === 'files' && (
            <div className="file-upload-mode">
              <div className="toggle-mode">
                <label>
                  <input type="radio" value="files"
                    checked={fileInputMode === 'files'}
                    onChange={() => setFileInputMode('files')} />
                  Select Files
                </label>
                <label>
                  <input type="radio" value="folder"
                    checked={fileInputMode === 'folder'}
                    onChange={() => setFileInputMode('folder')} />
                  Select Folder
                </label>
              </div>

              <input
                type="file"
                multiple
                {...(fileInputMode === 'folder' ? { webkitdirectory: 'true', directory: '' } : {})}
                onChange={(e) => setFiles(Array.from(e.target.files))}
                className="input-field"
              />
            </div>
          )}

          {selectedType === 'text' && (
            <textarea
              rows="4"
              placeholder="Enter your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="textarea-field"
            />
          )}

          {selectedType === 'link' && (
            <input
              type="url"
              placeholder="Paste your link..."
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="input-field"
            />
          )}
        </div>

        <button onClick={handleSubmit} className="submit-btn" disabled={uploading}>
          {uploading ? "Uploading..." : "Submit"}
        </button>

        {code && (
          <div className="result-container">
            <h3>Generated Code:</h3>
            <p>{code}</p>
            <a
              href={`https://airbridge-backend.vercel.app/download/${code}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              Download Files
            </a>
            {qrImage && (
              <div className="qr-preview">
                <h4>QR Code:</h4>
                <img src={qrImage} alt="QR Code" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadInterface;