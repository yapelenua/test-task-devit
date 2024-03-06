import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Підключення файлу стилів

function Client() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleStart = async () => {
    setIsLoading(true);
    const concurrencyLimit = parseInt(inputValue);
    let semaphore = concurrencyLimit;
    let currentIndex = 1;

    const sendRequest = async (index) => {
      try {
        const response = await axios.post('http://localhost:3002/api', { index });
        setResults((prevResults) => [...prevResults, response.data.index]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        semaphore++;
        if (currentIndex <= 1000) {
          sendNextRequest();
        } else if (semaphore === concurrencyLimit) {
          setIsLoading(false);
        }
      }
    };

    const sendNextRequest = () => {
      if (semaphore > 0 && currentIndex <= 1000) {
        semaphore--;
        sendRequest(currentIndex++);
      }
    };
    for (let i = 0; i < concurrencyLimit; i++) {
      sendNextRequest();
    }
  };

  return (
    <div className="client-container">
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        min="1"
        max="100"
        required
        className="input-field"
      />
      <button onClick={handleStart} disabled={isLoading} className="start-button">
        {isLoading ? 'Loading...' : 'Start'}
      </button>
      <ul className="results-list">
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export default Client;
