import React, { useState } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setDownloadUrl(null);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        responseType: 'blob',
        onUploadProgress: (event) => {
          setProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      const blob = new Blob([response.data], { type: 'video/mp4' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: 'auto', textAlign: 'center' }}>
      <h2>Comic Style Video Converter</h2>
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload} disabled={uploading || !videoFile}>
        {uploading ? 'Uploading...' : 'Convert & Download'}
      </button>

      {uploading && <p>Progress: {progress}%</p>}

      {downloadUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={downloadUrl} download="comic-style-video.mp4">
            Download Comic Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;