import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const Spirograph = () => {
  const [points, setPoints] = useState([]);
  const [R, setR] = useState(80);
  const [r, setr] = useState(36);
  const [O, setO] = useState(45);
  const canvasRef = useRef(null);

  const fetchPattern = () => {
    axios.get(`http://localhost:8000/api/patterns/?R=${R}&r=${r}&O=${O}`)
      .then(response => {
        setPoints(response.data.points);
      })
      .catch(error => {
        console.error('There was an error fetching the patterns!', error);
      });
  };

  useEffect(() => {
    fetchPattern();
  }, []);

  useEffect(() => {
    if (points.length > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(250 + point[0], 250 + point[1]);
        } else {
          ctx.lineTo(250 + point[0], 250 + point[1]);
        }
      });
      ctx.stroke();
    }
  }, [points]);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchPattern();
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'spirograph.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <h1>Spirograph Patterns</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            R:
            <input type="number" value={R} onChange={(e) => setR(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            r:
            <input type="number" value={r} onChange={(e) => setr(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            O:
            <input type="number" value={O} onChange={(e) => setO(e.target.value)} />
          </label>
        </div>
        <button type="submit">Generate Pattern</button>
      </form>
      <button onClick={saveImage}>Save Image</button>
      <canvas ref={canvasRef} id="spiroCanvas" width="500" height="500" style={{ border: '1px solid black' }}></canvas>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Spirograph />} />
      </Routes>
    </Router>
  );
};

export default App;
