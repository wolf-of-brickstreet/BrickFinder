import { useEffect, useRef, useState } from 'react';
import BrickResultComponent from './BrickResultComponent.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRotate, faXmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './CameraPopupComponentStyles.css';
import ResultListComponent from './ResultListComponent.js'

function CameraPopupComponent({ isOpen, onClose, itemsByStorage }) {
  const [cameraFacingMode, setCameraFacingMode] = useState(`environment`);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Canvas auf Videogröße setzen
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Bild vom Video zeichnen
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // In Blob (JPEG) umwandeln
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('query_image', blob, 'photo.jpg');

      setLoading(true);
      try {
        const response = await fetch('https://api.brickognize.com/predict/', {
          method: 'POST',
          headers: {
            // Achtung: KEIN Content-Type setzen bei multipart/form-data!
            accept: 'application/json',
          },
          body: formData,
        });

        const data = await response.json();
        setResult(data);
        console.log('Ergebnis:', data);
      } catch (error) {
        console.error('Fehler beim API-Aufruf:', error);
      } finally {
        setLoading(false);
      }
    }, 'image/jpeg');
  };

  function handleCameraSwitch() {
    cameraFacingMode === `user` ? setCameraFacingMode(`environment`) : setCameraFacingMode(`user`);
  }

  function renderResults() {
    return (
      <div className="resultContainer">
        <div className="backButtonContainer">
          <FontAwesomeIcon icon={faArrowLeft} onClick={() => setResult(null)} className="backButton"/>
          <FontAwesomeIcon icon={faXmark} onClick={onClose} className="backButton"/>
        </div>
        <ResultListComponent bricks={result.items} itemsByStorage={itemsByStorage} />
      </div>
    )
  }

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div className='cameraContainer' style={{ display: result ? 'none' : 'block' }}>
          <video ref={videoRef} autoPlay playsInline muted className="cameraVideo" />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className='cameraControls'>
            <div className='buttonContainer'>
              <FontAwesomeIcon icon={faCameraRotate} onClick={() => handleCameraSwitch()} className="imageButton"/>
              <div className="outer-ring" onClick={() => handleCapture()} disabled={loading}>
                <div className="inner-circle"></div>
              </div>
              <FontAwesomeIcon icon={faXmark} onClick={onClose} className="imageButton"/>
            </div>
          </div>
        </div>
        <div className="resultContainer">
          {loading && <p>Lade...</p>}
          {result && (
            <div>{ renderResults() }</div>
          )}
        </div>
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
    background: 'white', borderRadius: '10px', width: '90%', maxWidth: 400,
    position: 'relative', height: `70%`
  },
  closeBtn: {
    marginTop: 10, padding: '8px 16px'
  }
};

export default CameraPopupComponent;
