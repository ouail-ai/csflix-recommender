import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const movies = await appDataSource.getRepository(Movie).find();
    res.json({ movies: movies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

router.get('/populate', async (req, res) => {
  const allMovies = [];
  const totalPages = 20;
  const movieRepository = appDataSource.getRepository(Movie);

  try {
    for (let page = 4; page <= totalPages; page++) {
      console.log(`Fetching page ${page}`);
      const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
        params: {
          page: page,
        },
      });

      allMovies.push(...response.data.results);
    }

    console.log(allMovies);

    for (const movieData of allMovies) {
      const newMovie = movieRepository.create({
        id: movieData.id,
        original_title: movieData.title,
        release_date: movieData.release_date,
        original_language: movieData.original_language,
        backdrop_path: movieData.backdrop_path,
        genre_ids: movieData.genre_ids,
        adult: movieData.adult,
 
      });

      try {
        await movieRepository.save(newMovie);
        console.log(`Film "${newMovie.original_title}" ajouté à la base de données.`);
      } catch (error) {
        console.error(`Erreur lors de l'ajout du film "${newMovie.original_title}": ${error.message}`);
      }
    }

    res.status(200).send('Films ajoutés à la base de données.');
  } catch (error) {
    console.error('Error fetching movies :', error.message);
    if (!res.headersSent) {
      res.status(500).send('Erreur lors de la récupération des films.');
    }
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await appDataSource.getRepository(Movie).findOne({ id: req.params.id });
    if (movie) {
      res.json(movie);
    } else {
      res.status(404).json({ message: 'HTTP 404 NOT FOUND' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie' });
  }
});

router.post('/new', async (req, res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    id: req.body.id,
    original_title: req.body.original_title,
    release_date: req.body.release_date,
    adult : req.body.adult,
    backdrop_path: req.body.backdrop_path,
    original_language: req.body.original_language,
    genre_ids: req.body.genre_ids

  });

  try {
    const savedMovie = await movieRepository.save(newMovie);
    res.status(201).json({
      message: 'Movie successfully created',
      id: savedMovie.id,
    });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      res.status(400).json({
        message: `Movie with name "${newMovie.original_title}" already exists`,
      });
    } else {
      res.status(500).json({ message: 'Error while creating the Movie' });
    }
  }
});




export default router;

