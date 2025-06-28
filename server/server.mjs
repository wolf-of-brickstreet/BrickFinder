// server.js (Node.js-Backend)
import express from 'express';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.text({ type: 'application/xml' }));

app.post('/save-xml', (req, res) => {
  const xmlData = req.body;
  fs.writeFile('../src/Data/TestBrickstore.bsx', xmlData, (err) => {
    if (err) return res.status(500).send('Fehler beim Schreiben');
    res.send('XML gespeichert');
  });
});

app.listen(3001, () => console.log('Server läuft auf Port 3001'));
