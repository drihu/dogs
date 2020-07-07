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
  // const [options, setOptions] = useState(null);
  const [query, setQuery] = useState('');
  const [dogImages, setDogImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // useEffect(() => {
  //   fetch('https://dog.ceo/api/breeds/list/all')
  //     .then((res) => res.json())
  //     .then((data) => Object.keys(data.message))
  //     .then((breeds) => setOptions(breeds));
  // }, []);

  useEffect(() => {
    setIsError(false);
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

    const fetchDogs = () => {
      return fetch(`https://dog.ceo/api/breed/${query}/images`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') return data.message;
          else throw new Error(data.message);
        })
        .then((urls) => {
          setDogImages(urls);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsError(true);
          setIsLoading(false);
        });
    };

    const timerId = setTimeout(fetchDogs, 1000);
    return () => clearTimeout(timerId);
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
          {/* <select
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
          </select> */}

          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a breed"
            className="main__select"
          />

          {isError ? (
            <div className="error">No results found</div>
          ) : isLoading ? (
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
