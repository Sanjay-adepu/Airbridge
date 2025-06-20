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
    const formData = new FormData();
    if (selectedType === 'files') {
      if (files.length === 0) return alert("Please select at least one file.");
      files.forEach(file => formData.append('files', file));
    } else if (selectedType === 'text') {
      if (!text.trim()) return alert("Please enter some text.");
      formData.append('text', text);
    } else if (selectedType === 'link') {
      if (!link.trim()) return alert("Please enter a link.");
      formData.append('link', link);
    }

    try {
      const response = await axios.post('https://airbridge-backend.vercel.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      setCode(response.data.code);

      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${response.data.code}`);
      setQrImage(qrRes.data.qr);
    } catch (error) {
      console.error('Upload error:', error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="upload-container">
        <div className="instructions">
          <h2>How to Upload</h2>
          <p>
            1. Select the type of data you want to upload: <strong>Files</strong>, <strong>Text</strong>, or <strong>Link</strong>.<br />
            2. Based on your selection, provide the required input and click <strong>Submit</strong>.
          </p>
          <p className="file-info">
            <strong>File Upload Info:</strong><br />
            - You can select <strong>multiple files</strong> or an entire <strong>folder</strong>.<br />
            - Supported types: <strong>Images, PDFs, PPTs, Word Docs, MP3s, MP4s, APKs</strong>, and more.
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