import React, { useState } from 'react';
import axios from 'axios';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [code, setCode] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setCode('');
    setUploadedFiles([]);
    setQr('');
    setError('');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    setUploading(true);
    setError('');

    try {
      const response = await axios.post('https://airbridge-backend.vercel.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { code, files } = response.data;
      setCode(code);
      setUploadedFiles(files);

      // Fetch QR code
      const qrRes = await axios.get(`https://airbridge-backend.vercel.app/qrcode/${code}`);
      setQr(qrRes.data.qr);
    } catch (err) {
      console.error(err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>📤 Upload Files</h2>

      <input type="file" multiple onChange={handleFileChange} style={styles.input} />

      <button onClick={handleUpload} disabled={uploading || files.length === 0} style={styles.button}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {code && (
        <div style={styles.result}>
          <p><strong>Code:</strong> {code}</p>

          <p><strong>Files:</strong></p>
          <ul>
            {uploadedFiles.map((file, i) => (
              <li key={i}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
              </li>
            ))}
          </ul>

          {qr && (
            <div>
              <p><strong>QR Code (scan to preview):</strong></p>
              <img src={qr} alt="QR Code" style={styles.qr} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center'
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    padding: '10px 20px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  result: {
    marginTop: 20,
    textAlign: 'left'
  },
  qr: {
    marginTop: 10,
    width: 200
  },
  error: {
    color: 'red',
    marginTop: 10,
  }
};

export default Upload;