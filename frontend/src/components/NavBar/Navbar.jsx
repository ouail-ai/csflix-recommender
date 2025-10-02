import React, { useEffect, useRef, useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import search_bar from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.svg';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import TitleCards from '../TitleCards/TitleCards';
import TitleCardsfiltr from '../TitleCardsfiltr/TitleCardsfiltr';
import TitleCardsRecom from '../TitleCardsRecom/TitleCardsrecom';

const Navbar = ({ iduser }) => {
  const navigate = useNavigate();

  const navRef = useRef();

  const [query, setQuery] = useState();

  const handleInputChange = (e) => {
    const text = e.target.value;

    setQuery(text);
    setShowFilterBar(text.trim().length > 0);
  };

  const handleSearch = () => {
    console.log('Search query:', query);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    });
  }, []);

  return (
    <>
      <div ref={navRef} className="navbar">
        <div className="navbar-left">
          <img
            src={logo}
            alt=""
            onClick={() => {
              navigate(0);
            }}
          />
          <ul>
            <li
              onClick={() => {
                navigate(0);
              }}
            >
              Home
            </li>

            <Link to="/addmovie" className="nav-link">
              <p> Add Movie</p>
            </Link>
          </ul>
        </div>
        <div className="navbar-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Rechercher..."
              className="search-input"
              value={query}
              onChange={handleInputChange}
            />
          </div>

          <div className="navbar-profile">
            <Link to="/signin" className="nav-link">
              <p>Add user</p>
            </Link>
            <img src={profile_img} alt="" className="profile" />
          </div>
        </div>
      </div>
      <div className="search_zone">
        <TitleCards
          title="All Movies"
          category="now_playing"
          query={query}
          iduser={iduser}
        />
        <TitleCardsRecom
          title="Recommmended For You"
          category={'top_rated'}
          iduser={iduser}
        />
        <TitleCardsfiltr title={'Filtered By Language'} category={'filtered'} />
      </div>
    </>
  );
};

export default Navbar;
