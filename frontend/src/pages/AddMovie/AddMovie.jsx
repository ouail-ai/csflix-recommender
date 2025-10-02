import './AddMovie.css';
import AddMovieForm from '../../components/AddMovieForm/AddMovieForm';
import MoviesTable from '../../components/MoviesTable/MoviesTable';
import { useFetchMovies } from './UseFetchMovies';

function Movies() {
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();

  return (
    <div className="Users-container">
      <h1>You can add your movie here</h1>
      <AddMovieForm onSuccessfulMovieCreation={fetchMovies} />
      <MoviesTable movies={movies} onSuccessfulMovieDeletion={fetchMovies} />
      {moviesLoadingError !== null && (
        <div className="users-loading-error">{moviesLoadingError}</div>
      )}
    </div>
  );
}

export default Movies;
