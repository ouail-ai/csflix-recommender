import { useState } from 'react';
import axios from 'axios';
import './AddMovieForm.css';

const DEFAULT_FORM_VALUES = {
  id: -1,
  original_title: '',
  release_date: '',
  adult: true,
  backdrop_path: '',
  original_language: '',
  genre_ids: [],
};

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

function AddMovieForm({ onSuccessfulMovieCreation }) {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);
  const [movieCreationError, setMovieCreationError] = useState(null);
  const [movieCreationSuccess, setMovieCreationSuccess] = useState(null);

  const displayCreationSuccessMessage = () => {
    setMovieCreationSuccess('New movie created successfully');
    setTimeout(() => {
      setMovieCreationSuccess(null);
    }, 3000);
  };

  const saveMovie = (event) => {
    // This avoid default page reload behavior on form submit
    event.preventDefault();

    setMovieCreationError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/movies/new`, formValues)
      .then(() => {
        displayCreationSuccessMessage();
        setFormValues(DEFAULT_FORM_VALUES);
        onSuccessfulMovieCreation();
      })
      .catch((error) => {
        setMovieCreationError('An error occurred while creating new movie.');
        console.error(error);
      });
  };

  const handleGenreChange = (genreId) => {
    setFormValues((prevValues) => {
      const genreIds = prevValues.genre_ids.includes(genreId)
        ? prevValues.genre_ids.filter((id) => id !== genreId)
        : [...prevValues.genre_ids, genreId];

      return { ...prevValues, genre_ids: genreIds };
    });
  };

  return (
    <div>
      <form className="add-user-form" onSubmit={saveMovie}>
        <input
          className="add-user-input"
          required
          type="number"
          placeholder="id"
          value={formValues.id}
          onChange={(event) =>
            setFormValues({ ...formValues, id: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="original_title"
          value={formValues.original_title}
          onChange={(event) =>
            setFormValues({ ...formValues, original_title: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="Release date"
          value={formValues.release_date}
          onChange={(event) =>
            setFormValues({ ...formValues, release_date: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="Backdrop path"
          value={formValues.backdrop_path}
          onChange={(event) =>
            setFormValues({ ...formValues, backdrop_path: event.target.value })
          }
        />
        <input
          className="add-user-input"
          placeholder="Original language"
          value={formValues.original_language}
          onChange={(event) =>
            setFormValues({
              ...formValues,
              original_language: event.target.value,
            })
          }
        />
        <div className="genre-checkboxes">
          {GENRES.map((genre) => (
            <label key={genre.id}>
              <input
                type="checkbox"
                value={genre.id}
                checked={formValues.genre_ids.includes(genre.id)}
                onChange={() => handleGenreChange(genre.id)}
              />
              {genre.name}
            </label>
          ))}
        </div>
        <select
          className="add-user-select"
          value={formValues.adult}
          onChange={(event) =>
            setFormValues({
              ...formValues,
              adult: event.target.value === 'true',
            })
          }
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
        <button className="add-user-button" type="submit">
          Add movie
        </button>
      </form>
      {movieCreationSuccess !== null && (
        <div className="user-creation-success">{movieCreationSuccess}</div>
      )}
      {movieCreationError !== null && (
        <div className="user-creation-error">{movieCreationError}</div>
      )}
    </div>
  );
}

export default AddMovieForm;
