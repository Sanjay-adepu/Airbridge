import React, { useState } from 'react';
import './Upload.css';
import Navbar from "./Navbar/Navbar.jsx";
import axios from 'axios';

const UploadInterface = () => {
  const [selectedType, setSelectedType] = useState('files');
  const [fileInputMode, setFileInputMode] = useState('files');
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [qrImage, setQrImage] = useState('');

  const handleSubmit = async () => {
    try {
      let uploadedUrls = [];

      if (selectedType === 'files') {
        if (files.length === 0) return alert("Please select at least one file.");

        const res = await fetch('https://uploadthing.com/api/uploadFiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files: files.map(f => ({
              name: f.name,
              size: f.size,
              type: f.type,
            })),
            appId: 'rg07gnkko6',
            route: 'fileUploader',
          }),
        });

        const { urls } = await res.json();

        for (let i = 0; i < files.length; i++) {
          await fetch(urls[i].url, {
            method: 'PUT',
            headers: { 'Content-Type': files[i].type },
            body: files[i],
          });
          uploadedUrls.push(urls[i].url.split('?')[0]);
        }
      }

      const backendRes = await axios.post('https://airbridge-backend.vercel.app/upload', {
        uploadedUrls,
        text,
        link,
      });

      setCode(backendRes.data.code);

      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${backendRes.data.code}`);
      setQrImage(qrRes.data.qr);
    } catch (err) {
      console.error('Upload error:', err);
      alert("Upload failed.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <div className="instructions">
          <h2>How to Upload</h2>
          <p>
            1. Select type: <strong>Files</strong>, <strong>Text</strong>, or <strong>Link</strong>.<br />
            2. Provide input, click <strong>Submit</strong>.
          </p>
          <p className="file-info">
            <strong>File Info:</strong><br />
            - Multiple or folder upload<br />
            - Types: Images, PDFs, MP4, APKs, etc.
          </p>
          <hr />
        </div>

        <div className="option-container">
          {['files', 'text', 'link'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`option-btn ${selectedType === type ? 'active' : ''}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="dynamic-field">
          {selectedType === 'files' && (
            <div className="file-upload-mode">
              <div className="toggle-mode">
                <label>
                  <input
                    type="radio"
                    value="files"
                    checked={fileInputMode === 'files'}
                    onChange={() => setFileInputMode('files')}
                  />
                  Select Files
                </label>
                <label>
                  <input
                    type="radio"
                    value="folder"
                    checked={fileInputMode === 'folder'}
                    onChange={() => setFileInputMode('folder')}
                  />
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

        <button onClick={handleSubmit} className="submit-btn">
          Submit
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