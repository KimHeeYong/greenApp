import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';  // 스타일을 위한 CSS 파일 추가

const Spirograph = () => {
  const [points, setPoints] = useState([]);
  const [R, setR] = useState(80);
  const [r, setr] = useState(36);
  const [O, setO] = useState(45);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const fetchPattern = (newR = R, newr = r, newO = O) => {
    if (newR <= 0 || newr <= 0 || newO <= 0) {
      setError('R, r, O values must be positive numbers.');
      return;
    }
    setError('');
    axios.get(`http://localhost:8000/api/patterns/?R=${newR}&r=${newr}&O=${newO}`)
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

  const handleInputChange = (setter) => (event) => {
    const value = Number(event.target.value);
    setter(value);
    fetchPattern(R, r, O);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'spirograph.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="container">
      <h1>Spirograph Patterns</h1>
      <form>
        <div className="form-group">
          <label>R:</label>
          <input type="number" value={R} onChange={handleInputChange(setR)} />
        </div>
        <div className="form-group">
          <label>r:</label>
          <input type="number" value={r} onChange={handleInputChange(setr)} />
        </div>
        <div className="form-group">
          <label>O:</label>
          <input type="number" value={O} onChange={handleInputChange(setO)} />
        </div>
        {error && <div className="error">{error}</div>}
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
