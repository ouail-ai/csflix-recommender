import axios from 'axios';
import './MoviesTable.css';

function MoviesTable({ movies, onSuccessfulMovieDeletion }) {
  const deleteMovie = (movieId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/users/${movieId}`)
      .then(() => onSuccessfulMovieDeletion());
  };

  return (
    <div>
      <table className="users-table">
        <thead>
          <tr>
            <th>id</th>
            <th>release date</th>
            <th>original title</th>
            <th>original language </th>

            <th>adult</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>{movie.release_date}</td>
              <td>{movie.original_title}</td>
              <td>{movie.original_language}</td>
              <td>{movie.adult ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MoviesTable;
