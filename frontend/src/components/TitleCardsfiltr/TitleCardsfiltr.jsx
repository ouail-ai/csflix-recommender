import React, { useEffect, useRef, useState } from 'react';
import './TitleCardsfiltr.css';
import { Link } from 'react-router-dom';

const TitleCardsfiltr = ({ title, iduser }) => {
  const [movies, setMovies] = useState([]);
  const [languageFilter, setLanguageFilter] = useState('');

  const cardsRef = useRef();

  const handleLanguageChange = (e) => {
    setLanguageFilter(e.target.value);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/movies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.movies); // Assurez-vous que c'est bien un tableau de films
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();

    cardsRef.current?.addEventListener('wheel', handleWheel);

    return () => {
      cardsRef.current?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="title-cards">
      <div className="select-up">
        <h2>{title ? title : 'Popular on CSFlix'}</h2>
        <select
          value={languageFilter}
          onChange={handleLanguageChange}
          className="select"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="ko">Korean</option>
          <option value="ja">Japanese</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>
          <option value="ru">Russian</option>
          <option value="it">Italian</option>
          <option value="ar">Arabic</option>
        </select>
      </div>
      <div className="card-list" ref={cardsRef}>
        {movies
          .filter(
            (movie) =>
              languageFilter === '' ||
              movie.original_language.toLowerCase() ===
                languageFilter.toLowerCase()
          )
          .map((movie, index) => (
            <Link to={`./details/${movie.id}`} className="card" key={index}>
              <img
                src={'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}
                alt=""
              />
              <p>{movie.original_title}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default TitleCardsfiltr;
