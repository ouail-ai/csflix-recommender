import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Users from './pages/SignIn/SignIn.jsx';
import Movie from './pages/AddMovie/AddMovie.jsx';
import Details from './pages/Details/Details.jsx';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<Users />}></Route>
        <Route path="/addmovie" element={<Movie />}></Route>
        <Route path="/:iduser" element={<Home />}></Route>
        <Route path="/:iduser/details/:idmovie" element={<Details />}></Route>
      </Routes>
    </div>
  );
};

export default App;
