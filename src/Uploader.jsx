import React, { useState } from 'react';
import './Upload.css';
import Navbar from "./Navbar/Navbar";
import axios from 'axios';
import { Client, Storage, ID } from 'appwrite';

const UploadInterface = () => {
  const [selectedType, setSelectedType] = useState('files');
  const [fileInputMode, setFileInputMode] = useState('files');
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [qrImage, setQrImage] = useState('');

  const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('68652aa600367167ca15');

  const storage = new Storage(client);

  const handleSubmit = async () => {
    if (selectedType === 'files') {
      if (files.length === 0) return alert("Please select at least one file.");

      try {
        const uploadedFiles = [];

        for (const file of files) {
          const uniqueId = ID.unique();
          const result = await storage.createFile(
            '6865306c0007bdcc08f0', // Bucket ID
            uniqueId,
            file
          );

          const previewUrl = `https://nyc.cloud.appwrite.io/v1/storage/buckets/6865306c0007bdcc08f0/files/${result.$id}/view?project=68652aa600367167ca15`;

          uploadedFiles.push({
            name: file.name,
            type: file.type,
            url: previewUrl
          });
        }

        const response = await axios.post('https://airbridge-backend.vercel.app/upload', {
          files: uploadedFiles,
          text: '',
          link: '',
        });

        setCode(response.data.code);

        const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${response.data.code}`);
        setQrImage(qrRes.data.qr);

      } catch (err) {
        console.error('Appwrite upload failed:', err);
        alert('Upload failed');
      }
    } else {
      try {
        const response = await axios.post('https://airbridge-backend.vercel.app/upload', {
          files: [],
          text,
          link,
        });

        setCode(response.data.code);

        const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${response.data.code}`);
        setQrImage(qrRes.data.qr);

      } catch (err) {
        console.error('Text/Link upload failed:', err);
        alert("Upload failed");
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
            1. Select <strong>Files</strong>, <strong>Text</strong>, or <strong>Link</strong>.<br />
            2. Click <strong>Submit</strong> to generate a code and QR.
          </p>
          <p className="file-info">
            <strong>File Info:</strong><br />
            Multiple files, folders, formats: images, PDFs, videos, APKs, etc.
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