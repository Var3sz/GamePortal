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
import { IProviderValue, UserContext } from './UserContext';


function App() {
  const [player, setPlayer] = useState<Player | null>(null);

  const providerValue = useMemo<IProviderValue>(
    () => ({ player, setPlayer }),
    [player, setPlayer]
  );


  return (
    <>
      <UserContext.Provider value={providerValue}>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chess/" element={<Chess />}></Route>
          <Route path="/connect4/" element={<Connect4 />}></Route>
          {player != null ? (
            <></>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
          <Route path="/login/" element={<Login />}></Route>
          <Route path="/register/" element={<Register />}></Route>

          {player?.userName === "admin" ? (
            <Route path="/admin" element={<ManagePlayers />}></Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
