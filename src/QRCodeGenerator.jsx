import React, { useState } from 'react';
import QRCode from 'qrcode';

function QRCodeGenerator() {
  const [inputValue, setInputValue] = useState('');
  const [qrCodeImage, setQRCodeImage] = useState('');

  const createQRCode = async () => {
    if (inputValue) {
      try {
        const qrDataUrl = await QRCode.toDataURL(inputValue, { width: 280 });
        setQRCodeImage(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    } else {
      alert('Enter data in the input field first.');
    }
  };

  const saveQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = 'qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No QR code to save.');
    }
  };

  return (
    <div className="container">
      <div className="qr-code">
        {qrCodeImage && <img src={qrCodeImage} alt="QR Code" />}
      </div>
      <input
        type="text"
        className="input-field"
        placeholder="Enter data"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="btn" onClick={createQRCode}>Create</button>
      <button className="btn" onClick={saveQRCode}>Save</button>
    </div>
  );
}

export default QRCodeGenerator;
