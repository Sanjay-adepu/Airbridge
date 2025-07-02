import React, { useState } from 'react';
import './Upload.css';
import Navbar from './Navbar/Navbar.jsx';
import axios from 'axios';

const UploadInterface = () => {
  const [selectedType, setSelectedType] = useState('files');
  const [fileInputMode, setFileInputMode] = useState('files');
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
  try {
    setLoading(true);
    let uploadedFiles = [];

    if (selectedType === 'files') {
      if (files.length === 0) return alert('Please select at least one file.');

      for (const file of files) {
        const form = new FormData();
        form.append('file', file);

        const uploadRes = await axios.post('https://temp.sh/upload', form, {
          maxBodyLength: Infinity,
        });

        uploadedFiles.push({
          name: file.name,
          url: uploadRes.data.trim(),
        });
      }
    }

    const res = await axios.post('https://airbridge-backend.vercel.app/upload', {
      files: uploadedFiles,
      text,
      link,
    });

    setCode(res.data.code);

    const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${res.data.code}`);
    setQrImage(qrRes.data.qr);
  } catch (err) {
    console.error('Upload failed:', err);
    alert(err.response?.data?.message || 'Upload failed');
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      <Navbar />
      <div className="upload-container">
        <div className="instructions">
          <h2>How to Upload</h2>
          <p>
            1. Select the type of data: <strong>Files</strong>, <strong>Text</strong>, or <strong>Link</strong>.<br />
            2. Submit to generate a code and QR.
          </p>
          <p className="file-info">
            <strong>File Info:</strong><br />
            - Upload multiple files or folder<br />
            - PDFs, DOCs, MP4s, ZIPs, PPTs, APKs supported<br />
            - Auto-delete after 2 minutes
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

        <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit'}
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