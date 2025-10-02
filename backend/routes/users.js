import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';

const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

router.post('/new', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    liked_movies : [0],
    disliked_movies : [0],
    adult : req.body.adult,
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'User successfully created',
        id: savedUser.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

router.post('/add_like', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const userId = req.body.userId; // L'ID de l'utilisateur dont vous voulez mettre à jour la liste liked_movies
  const movieId = req.body.movieId; // L'ID du film à ajouter à la liste liked_movies

  userRepository.findOneBy({ id: userId })
  .then(user => {
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).send("Utilisateur non trouvé");
    }

    if (!user.liked_movies) {
      user.liked_movies = [];
    }

    if (user.liked_movies.includes(movieId.toString())) {
      console.log("Le film est déjà dans la liste liked_movies de l'utilisateur");
      return res.status(400).send("Le film est déjà dans la liste liked_movies de l'utilisateur");
    }

    // Si le film est dans la liste disliked_movies, le retirer
    if (user.disliked_movies && user.disliked_movies.includes(movieId.toString())) {
      user.disliked_movies = user.disliked_movies.filter(id => id !== movieId.toString());
    }

    user.liked_movies.push(movieId.toString());

    // Enregistrer les modifications dans la base de données
    userRepository.save(user)
    .then(updatedUser => {
      console.log("Utilisateur mis à jour avec succès :", updatedUser);
      res.status(200).send("Film ajouté à la liste liked_movies de l'utilisateur avec succès");
    })
    .catch(err => {
      console.error("Erreur lors de l'enregistrement des modifications dans la base de données :", err);
      res.status(500).send("Erreur lors de l'enregistrement des modifications dans la base de données");
    });
  })
  .catch(err => {
    console.error("Erreur lors de la recherche de l'utilisateur dans la base de données :", err);
    res.status(500).send("Erreur lors de la recherche de l'utilisateur dans la base de données");
  });
});



router.post('/add_dislike', function (req, res) {
  const userRepository = appDataSource.getRepository(User);
  const userId = req.body.userId; // L'ID de l'utilisateur dont vous voulez mettre à jour la liste disliked_movies
  const movieId = req.body.movieId; // L'ID du film à ajouter à la liste disliked_movies

  userRepository.findOneBy({ id: userId })
  .then(user => {
    if (!user) {
      console.log("Utilisateur non trouvé");
      return res.status(404).send("Utilisateur non trouvé");
    }
    
    if (!user.disliked_movies) {
      user.disliked_movies = [];
    }

    // Vérifier si le film est déjà dans la liste disliked_movies
    if (user.disliked_movies.includes(movieId.toString())) {
      console.log("Le film est déjà dans la liste disliked_movies de l'utilisateur");
      return res.status(400).send("Le film est déjà dans la liste disliked_movies de l'utilisateur");
    }

    // Si le film est dans la liste liked_movies, le retirer
    if (user.liked_movies && user.liked_movies.includes(movieId.toString())) {
      user.liked_movies = user.liked_movies.filter(id => id !== movieId.toString());
    }

    user.disliked_movies.push(movieId.toString());

    userRepository.save(user)
    .then(updatedUser => {
      console.log("Utilisateur mis à jour avec succès :", updatedUser);
      res.status(200).send("Film ajouté à la liste disliked_movies de l'utilisateur avec succès");
    })
    .catch(err => {
      console.error("Erreur lors de l'enregistrement des modifications dans la base de données :", err);
      res.status(500).send("Erreur lors de l'enregistrement des modifications dans la base de données");
    });
  })
  .catch(err => {
    console.error("Erreur lors de la recherche de l'utilisateur dans la base de données :", err);
    res.status(500).send("Erreur lors de la recherche de l'utilisateur dans la base de données");
  });
});




router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
