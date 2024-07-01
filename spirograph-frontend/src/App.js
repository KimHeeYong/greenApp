import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';  // 스타일을 위한 CSS 파일 추가

const Spirograph = () => {
  const [points, setPoints] = useState([]);
  const [R, setR] = useState(80);
  const [r, setr] = useState(36);
  const [O, setO] = useState(45);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [patternType, setPatternType] = useState('circle');
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const fetchPattern = (newR = R, newr = r, newO = O, newPatternType = patternType) => {
    if (newR <= 0 || newr <= 0 || newO <= 0) {
      setError('R, r, O values must be positive numbers.');
      return;
    }
    setError('');
    axios.get(`http://localhost:8000/api/patterns/?R=${newR}&r=${newr}&O=${newO}&type=${newPatternType}`)
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
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(250 + point[0], 250 + point[1]);
        } else {
          ctx.lineTo(250 + point[0], 250 + point[1]);
        }
      });
      ctx.stroke();
    }
  }, [points, color, lineWidth]);

  const handleInputChange = (setter) => (event) => {
    const value = Number(event.target.value);
    setter(value);
    fetchPattern(R, r, O);
  };

  const handlePatternTypeChange = (event) => {
    const value = event.target.value;
    setPatternType(value);
    fetchPattern(R, r, O, value);
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
          <label>Pattern Type:</label>
          <select value={patternType} onChange={handlePatternTypeChange}>
            <option value="circle">Circle</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            {/* 추가 패턴 종류를 여기에 추가할 수 있습니다 */}
          </select>
        </div>
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
        <div className="form-group">
          <label>Color:</label>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Line Width:</label>
          <input type="number" value={lineWidth} min="1" max="10" onChange={(e) => setLineWidth(Number(e.target.value))} />
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
