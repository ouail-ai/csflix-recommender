import React, { useEffect, useRef, useState } from 'react';
import './TitleCardsRecom.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TitleCardsRecom = ({ title, category, query, iduser }) => {
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const cardsRef = useRef();

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users`
      );
      const users = response.data.users;
      console.log('Fetched users:', users);
      console.log('First user:', users[0]);

      return users;
    } catch (error) {
      console.error('Error fetching users', error);

      return [];
    }
  };

  const getUserMovies = async (userId) => {
    try {
      const users = await getAllUsers();
      let user = null;
      for (let i = 0; i < users.length; i++) {
        console.log({ iduser });
        if (users[i].id === parseInt(iduser)) {
          user = users[i];
          break;
        }
      }
      console.log({ user });
      if (!user) {
        console.error(`User with ID ${userId} not found`);

        return { liked_movies: [], disliked_movies: [] };
      }
      console.log('User found:', user);
      const likedMovies = user.liked_movies.map((id) => parseInt(id));
      const dislikedMovies = user.disliked_movies.map((id) => parseInt(id));

      return {
        liked_movies: likedMovies,
        disliked_movies: dislikedMovies,
      };
    } catch (error) {
      console.error('Error fetching user movies', error);

      return { liked_movies: [], disliked_movies: [] };
    }
  };

  const calculateSimilarity = (movieA, movieB) => {
    const genresA = new Set(movieA.genre_ids);
    const genresB = new Set(movieB.genre_ids);
    const languageA = movieA.original_language;
    const languageB = movieB.original_language;

    const intersection = new Set(
      [...genresA].filter((genre) => genresB.has(genre))
    );
    const union = new Set([...genresA, ...genresB]);

    const genreSimilarity = intersection.size / union.size;

    // Ajouter 1 à la similarité si les langues sont les mêmes
    const languageSimilarity = languageA === languageB ? 1 : 0;

    return genreSimilarity + languageSimilarity;
  };

  const calculateAverageSimilarity = (targetMovie, likedMovies) => {
    const totalSimilarity = likedMovies.reduce((acc, likedMovie) => {
      return acc + calculateSimilarity(targetMovie, likedMovie);
    }, 0);

    return totalSimilarity / likedMovies.length;
  };

  const updateRecommendedMovies = (likedMovies, dislikedMovies) => {
    if (likedMovies.length === 0) {
      setRecommendedMovies([]);

      return;
    }

    const likedMoviesObjects = movies.filter((movie) =>
      likedMovies.includes(movie.id)
    );
    const similarities = movies
      .filter(
        (movie) =>
          !likedMovies.includes(movie.id) && !dislikedMovies.includes(movie.id)
      )
      .map((movie) => ({
        ...movie,
        similarity: calculateAverageSimilarity(movie, likedMoviesObjects),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    setRecommendedMovies(similarities);
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/movies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const parsedMovies = data.movies.map((movie) => ({
          ...movie,
          genre_ids: Array.isArray(movie.genre_ids)
            ? movie.genre_ids
            : movie.genre_ids.split(',').map(Number),
        }));
        setMovies(parsedMovies);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchUserMoviesAndUpdateRecommendations = async () => {
      const { liked_movies, disliked_movies } = await getUserMovies(iduser);
      console.log('Liked Movies:', liked_movies);
      console.log('Disliked Movies:', disliked_movies);
      updateRecommendedMovies(liked_movies, disliked_movies);
    };

    fetchMovies();
    fetchUserMoviesAndUpdateRecommendations();

    cardsRef.current?.addEventListener('wheel', handleWheel);

    return () => {
      cardsRef.current?.removeEventListener('wheel', handleWheel);
    };
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
        {recommendedMovies.length > 0 ? (
          recommendedMovies.map((movie, index) => (
            <Link to={`./details/${movie.id}`} className="card" key={index}>
              <img
                src={'https://image.tmdb.org/t/p/w500' + movie.backdrop_path}
                alt={movie.original_title}
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

export default TitleCardsRecom;
