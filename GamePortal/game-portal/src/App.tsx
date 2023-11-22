import * as React from 'react';
import '../src/css-files/styles.css'
import { Home } from "./pages/guest/Home";
import { Login } from "./pages/guest/Login";
import { Register } from "./pages/guest/Register";
import { Chess } from './pages/guest/Chess';
import { Connect4 } from './pages/guest/Connect4';
import { AppNavbar } from './components/AppNavbar';
import { Route, Routes } from 'react-router-dom';
import { ManagePlayers } from './pages/admin/ManagePlayers';
import { OnlineChess } from './pages/player/OnlineChess';
import { OnlineConnect4 } from './pages/player/OnlineConnect4';
import Layout from './Layout';
import RequireAuth from './auth/RequireAuth';
import Unauthorized from './pages/guest/Unauthorized';

const ROLES = {
  'Admin': 1,
  'Player': 2
}

function App() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* public routes */}
          <Route path="home" element={<Home />}></Route>
          <Route path="login" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>
          <Route path="unauthorized" element={<Unauthorized />}></Route>
          <Route path="chess" element={<Chess />}></Route>
          <Route path="connect4" element={<Connect4 />}></Route>

          {/* player routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Player]} />}>

            <Route path="onlinechess" element={<OnlineChess />} />
            <Route path="onlineconnect4" element={<OnlineConnect4 />} />
          </Route>

          {/* admin routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<ManagePlayers />}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
