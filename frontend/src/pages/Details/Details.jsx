import React, { useEffect, useState } from 'react';
import './Details.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import back_arrow_icon from '../../assets/back_arrow_icon.png';

const Details = () => {
  const { iduser, idmovie } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState({
    name: '',
    key: '',
    published_at: '',
    type: '',
  });

  const GENRES = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Science Fiction' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
  ];

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjQ2NzA0MzNiOWM2NmVjODAxYmM4YmUxZWIwMzlhMiIsInN1YiI6IjY2NWRiOGMyNjBlZGRkMTY5NWEwMjZhYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.x48FUJDKeJnO4C6ie_kr32Gamm6X9IcRZY-MEvvBqqg',
    },
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('http://localhost:8000/movies');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMovies(data.movies);

        const movie = data.movies.find(
          (movie) => movie.id === parseInt(idmovie)
        );
        setSelectedMovie(movie);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchMovieData = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${idmovie}/videos?language=en-US`,
          options
        );
        const data = await response.json();
        setApiData(data.results[0]);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      }
    };

    fetchMovies();
    fetchMovieData();
  }, [idmovie]);

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => {
        const genre = GENRES.find((genre) => genre.id === parseInt(id));

        return genre ? genre.name : 'Unknown';
      })
      .join(', ');
  };

  const handleLike = (userId, movieId) => {
    return (event) => {
      event.preventDefault(); // Empêcher le comportement par défaut

      // Fonction pour gérer l'ajout du film aux likes de l'utilisateur
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/users/add_like`, {
          userId,
          movieId,
        })
        .then((response) => {
          console.log(
            "Film ajouté à la liste liked_movies de l'utilisateur avec succès"
          );
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'ajout du film à la liste liked_movies de l'utilisateur",
            error
          );
        });
    };
  };

  const handleDislike = (userId, movieId) => {
    return (event) => {
      event.preventDefault(); // Empêcher le comportement par défaut

      // Fonction pour gérer l'ajout du film aux dislikes de l'utilisateur
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/users/add_dislike`, {
          userId,
          movieId,
        })
        .then((response) => {
          console.log(
            "Film ajouté à la liste disliked_movies de l'utilisateur avec succès"
          );
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'ajout du film à la liste liked_movies de l'utilisateur",
            error
          );
        });
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedMovie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="details">
      <img src={back_arrow_icon} alt="Back" onClick={() => navigate(-1)} />
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${apiData.key}`}
        title="trailer"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div className="details-info">
        <p className="Like" onClick={handleLike(iduser, idmovie)}>
          :) Like
        </p>
        <p>{selectedMovie.original_title}</p>
        <p>{selectedMovie.release_date}</p>
        <p>{selectedMovie.original_language}</p>
        <p>Genres: {getGenreNames(selectedMovie.genre_ids)}</p>
        <p className="DisLike" onClick={handleDislike(iduser, idmovie)}>
          :( DisLike{' '}
        </p>
      </div>
    </div>
  );
};

export default Details;
