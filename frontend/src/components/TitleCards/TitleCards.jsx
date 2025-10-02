import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';
import cards_data from '../../assets/cards/Cards_data';

const TitleCards = ({ title, category, query, iduser }) => {
  const [movies, setMovies] = useState([]);

  const cardsRef = useRef();

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
        // Assurez-vous que c'est bien un tableau de films
        const sortedMovies = data.movies.sort((a, b) => {
          // Assuming release_date is in YYYY-MM-DD format
          return new Date(b.release_date) - new Date(a.release_date);
        });

        setMovies(sortedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();

    cardsRef.current?.addEventListener('wheel', handleWheel);
  });

  const filteredData = movies.filter((movie) =>
    movie.original_title && query
      ? movie.original_title.toLowerCase().includes(query.toLowerCase())
      : true
  );

  return (
    <div className="title-cards">
      <h2>{title ? title : 'Popular on CSFlix'}</h2>
      <div className="card-list" ref={cardsRef}>
        {filteredData.length > 0 ? (
          filteredData.map((movie, index) => (
            <Link to={`./details/${movie.id}`} className="card" key={index}>
              <img
                src={'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}
                alt=""
              />
              <p>{movie.original_title}</p>
            </Link>
          ))
        ) : (
          <p>No movies found</p>
        )}
      </div>
    </div>
  );
};

export default TitleCards;
