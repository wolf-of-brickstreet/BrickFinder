import { useEffect, useRef, useState } from 'react';

function CameraPopupComponent({ isOpen, onClose }) {
  const [cameraFacingMode, setCameraFacingMode] = useState(`user`);

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

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <select id="cameras" name="cameras" onChange={(event) => setCameraFacingMode(event.target.value)}>
            <option value="user">front camera</option>
            <option value="environment">main camera</option>
        </select>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div>
          <button onClick={() => handleCapture()} disabled={loading}>
            📸 Foto aufnehmen
          </button>
          <button onClick={onClose} style={styles.closeBtn}>Schließen</button>
          {loading && <p>Lade...</p>}
          {result && (
            <pre style={{ marginTop: 10, maxHeight: 200, overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
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
    background: 'white', padding: 20, borderRadius: 8, width: '90%', maxWidth: 400,
    position: 'relative'
  },
  closeBtn: {
    marginTop: 10, padding: '8px 16px'
  }
};

export default CameraPopupComponent;
