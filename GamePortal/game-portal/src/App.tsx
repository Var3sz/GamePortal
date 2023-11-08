import React, { useEffect } from 'react';
import '../src/css-files/styles.css'
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Chess from './pages/Chess';
import Connect4 from "./pages/Connect4"
import AppNavbar from './components/AppNavbar';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { ManagePlayers } from './pages/ManagePlayers';
import { Player } from './models/player.model';
import OnlineChess from './pages/OnlineChess';
import OnlineConnect4 from './pages/OnlineConnect4';
import Layout from './Layout';
import RequireAuth from './auth/RequireAuth';


function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="home" element={<Home />}></Route>
          <Route path="chess" element={<Chess />}></Route>
          <Route path="connect4" element={<Connect4 />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>

          {/* player routes */}
          <Route element={<RequireAuth />}>
            <Route path="onlinechess" element={<OnlineChess />} />
            <Route path="onlineconnect4" element={<OnlineConnect4 />} />
          </Route>
          {/* admin routes */}
          <Route path="admin" element={<ManagePlayers />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
