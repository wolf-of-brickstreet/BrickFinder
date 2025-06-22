import { useEffect, useRef, useState } from 'react';

function CameraPopupComponent({ isOpen, onClose }) {
  const [cameraFacingMode, setCameraFacingMode] = useState(`user`);

  const videoRef = useRef(null);
  let streamRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    navigator.mediaDevices.getUserMedia({  video: { facingMode: cameraFacingMode } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            videoRef.current.play(); // Sicherheitshalber explizit starten
            }
      })
      .catch((err) => {
        console.error('Kamera-Zugriff fehlgeschlagen:', err);
      });

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, cameraFacingMode]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <select id="cameras" name="cameras" onChange={(event) => setCameraFacingMode(event.target.value)}>
            <option value="user">front camera</option>
            <option value="environment">main camera</option>
        </select>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
        <button onClick={onClose} style={styles.closeBtn}>Schließen</button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    background: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 400,
    position: 'relative'
  },
  closeBtn: {
    marginTop: 10, padding: '8px 16px'
  }
};

export default CameraPopupComponent;
