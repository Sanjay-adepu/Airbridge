import React, { useState } from 'react';
import Navbar from './Navbar/Navbar.jsx';
import './Upload.css';
import axios from 'axios';

// 🔐 UploadThing token (ensure this is secure for production)
const UPLOADTHING_TOKEN = 'eyJhcGlLZXkiOiJza19saXZlXzY3Nzc0NDMyZmI4YmY4ZWRiODdkMTYwZGMzZGY5ZTRhNGM5ZjA3OGI4MzRkNjgwZjMyMmJjOWE2MTIwMzJmM2UiLCJhcHBJZCI6InJnMDdnbmtrbzYiLCJyZWdpb25zIjpbInNlYTEiXX0=';

// ✅ Custom function to generate the upload URL (matches your backend flow)
const generateUploadThingUrl = (token) => {
  // Replace `customUploader` with the actual UploadThing endpoint slug if needed
  return `https://uploadthing.com/api/uploadFiles?slug=customUploader&utUploadToken=${token}`;
};

const UploadInterface = () => {
  const [selectedType, setSelectedType] = useState('files');
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [code, setCode] = useState('');
  const [qrImage, setQrImage] = useState('');

  const handleUpload = async () => {
    if (selectedType === 'files' && files.length === 0) {
      return alert('Please select at least one file.');
    }

    try {
      const fileData = new FormData();
      files.forEach((file) => fileData.append('files', file));

      const uploadRes = await fetch(generateUploadThingUrl(UPLOADTHING_TOKEN), {
        method: 'POST',
        body: fileData,
      });

      const result = await uploadRes.json();

      const uploadedFiles = result.files.map((file) => ({
        url: file.url,
        name: file.name,
        type: file.type,
        key: file.key,
      }));

      const sessionPayload = {
        files: uploadedFiles,
        text,
        link,
      };

      const saveRes = await axios.post('https://airbridge-backend.vercel.app/save', sessionPayload);
      const generatedCode = saveRes.data.code;
      setCode(generatedCode);

      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${generatedCode}`);
      setQrImage(qrRes.data.qr);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="upload-container">
        <h2>Upload Files / Text / Link</h2>

        <div className="upload-type-selector">
          <button onClick={() => setSelectedType('files')}>Files</button>
          <button onClick={() => setSelectedType('text')}>Text</button>
          <button onClick={() => setSelectedType('link')}>Link</button>
        </div>

        {selectedType === 'files' && (
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />
        )}
        {selectedType === 'text' && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
        )}
        {selectedType === 'link' && (
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter link..."
          />
        )}

        <button onClick={handleUpload}>Submit</button>

        {code && (
          <div className="result">
            <p><strong>Code:</strong> {code}</p>
            <a
              href={`https://airbridge-backend.vercel.app/download/${code}`}
              target="_blank"
              rel="noreferrer"
            >
              Download ZIP
            </a>
            {qrImage && <img src={qrImage} alt="QR Code" />}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadInterface;