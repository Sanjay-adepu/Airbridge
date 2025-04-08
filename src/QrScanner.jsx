import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => {
        console.warn('QR Scan Error:', error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      scanner.clear().catch((error) => console.error('Clear Error:', error));
    };
  }, [onScan]);

  return <div id="reader" style={{ width: '100%' }} />;
};

export default QrScanner;