import React, { useState, useEffect } from 'react';
import './App.css';

function Dog({ image }) {
  return (
    <div className="dog">
      <img src={image} className="dog__image" alt="dog" />
    </div>
  );
}

function App() {
  const [options, setOptions] = useState(null);
  const [query, setQuery] = useState('');
  const [dogImages, setDogImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((res) => res.json())
      .then((data) => Object.keys(data.message))
      .then((breeds) => setOptions(breeds));
  }, []);

  useEffect(() => {
    setIsLoading(true);

    if (!query) {
      Promise.all(
        [...Array(12)].map(() =>
          fetch('https://dog.ceo/api/breeds/image/random')
            .then((res) => res.json())
            .then((data) => data.message)
        )
      ).then((urls) => {
        setDogImages(urls);
        setIsLoading(false);
      });
      return;
    }

    fetch(`https://dog.ceo/api/breed/${query}/images`)
      .then((res) => res.json())
      .then((data) => data.message)
      .then((urls) => {
        setDogImages(urls);
        setIsLoading(false);
      });
  }, [query]);

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="header__title">Find a dog</h1>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <select
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="main__select"
          >
            <option value="">select a breed</option>
            {options &&
              options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>

          {isLoading ? (
            <div className="notice">Loading...</div>
          ) : (
            <div className="main__dogs">
              {dogImages &&
                dogImages.map((url, index) => <Dog image={url} key={index} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
