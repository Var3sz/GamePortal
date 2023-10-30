import React, { useEffect } from 'react';
import '../src/css-files/styles.css'
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Chess from './pages/Chess';
import Connect4 from "./pages/Connect4"
import AppNavbar from './components/AppNavbar';
import { Route, Routes } from 'react-router-dom';
import { ManagePlayers } from './pages/ManagePlayers';
import { useState } from 'react';
import { Container } from 'react-bootstrap';

function App() {
 return (
     <>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/admin" element={<ManagePlayers />}></Route>
          <Route path="/chess" element={<Chess />}></Route>
          <Route path="/connect4" element={<Connect4 />}></Route>
        </Routes>
    </>
  );
}

export default App;
