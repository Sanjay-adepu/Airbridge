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
  console.log("🟡 Upload started for:", selectedType);

  if (selectedType === 'files') {
    if (files.length === 0) {
      alert("❗ Please select at least one file.");
      return;
    }

    try {
      const uploadedFiles = [];

      for (const file of files) {
        console.log("📁 Uploading file to temp.sh:", file.name);
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('https://temp.sh/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        }).catch((err) => {
          console.error('❌ Temp.sh upload error:', err.response?.data || err.message);
          alert(`Temp.sh upload failed for: ${file.name}`);
          throw err;
        });

        let fileUrl = response.data;
        if (typeof fileUrl !== 'string') {
          fileUrl = fileUrl.toString();
        }
        fileUrl = fileUrl.trim();

        console.log("✅ File uploaded to Temp.sh:", fileUrl);

        uploadedFiles.push({
          name: file.name,
          type: file.type,
          url: fileUrl
        });
      }

      console.log("📦 Sending metadata to backend:", uploadedFiles);

      const uploadRes = await axios.post('https://airbridge-backend.vercel.app/upload', {
        files: uploadedFiles,
        text: '',
        link: ''
      });

      console.log("✅ Backend response:", uploadRes.data);
      setCode(uploadRes.data.code);

      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${uploadRes.data.code}`);
      console.log("🖼️ QR code generated");
      setQrImage(qrRes.data.qr);

      alert("✅ Upload and QR generation successful");

    } catch (err) {
      console.error('❌ Upload failed:', err);
      alert('Upload failed: ' + err.message);
    }

  } else {
    // Uploading text or link
    console.log("📝 Uploading text/link...");

    try {
      const response = await axios.post('https://airbridge-backend.vercel.app/upload', {
        files: [],
        text,
        link,
      });

      console.log("✅ Text/Link stored:", response.data);
      setCode(response.data.code);

      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${response.data.code}`);
      setQrImage(qrRes.data.qr);

      alert("✅ Text/Link uploaded successfully");

    } catch (err) {
      console.error('❌ Text/Link upload failed:', err);
      alert("Upload failed: " + err.message);
    }
  }
};



  return (
    <>
      <Navbar />
      <div className="upload-container">
        <div className="instructions">
          <h2>How to Upload</h2>
          <p>
            1. Select the type: <strong>Files</strong>, <strong>Text</strong>, or <strong>Link</strong>.<br />
            2. Provide input and click <strong>Submit</strong>.
          </p>
          <p className="file-info">
            <strong>File Info:</strong><br />
            - Select <strong>multiple files</strong> or <strong>folder</strong>.<br />
            - Types: Images, PDFs, Videos, APKs, etc.<br />
            - Max: ~2GB per file
          </p>
          <hr />
        </div>

        <div className="option-container">
          {['files', 'text', 'link'].map(type => (
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
                  /> Select Files
                </label>
                <label>
                  <input
                    type="radio"
                    value="folder"
                    checked={fileInputMode === 'folder'}
                    onChange={() => setFileInputMode('folder')}
                  /> Select Folder
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

        <button onClick={handleSubmit} className="submit-btn">Submit</button>

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