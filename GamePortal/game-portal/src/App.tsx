import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import '../src/css-files/styles.css'
import { Home } from "./pages/guest/Home";
import { Login } from "./pages/guest/Login";
import { Register } from "./pages/guest/Register";
import { Chess } from './pages/guest/Chess';
import { Connect4 } from './pages/guest/Connect4';
import { AppNavbar } from './components/Navbar/AppNavbar';
import { Route, Routes } from 'react-router-dom';
import { ManagePlayers } from './pages/admin/ManagePlayers';
import { OnlineChess } from './pages/player/OnlineChess';
import { OnlineConnect4 } from './pages/player/OnlineConnect4';
import { Layout } from './components/Layout';
import RequireAuth from './auth/RequireAuth';
import Unauthorized from './pages/guest/Unauthorized';
import customTheme from './theme/theme';
import OnlineGame from './pages/player/OnlineGame';
import ChooseOpponent from './pages/player/ChooseOpponent';

const ROLES = {
  'Admin': 1,
  'Player': 2
}

function App() {
  return (
    <ChakraProvider theme={customTheme}>
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
            <Route path="chooseopponent/:gameType" element={<ChooseOpponent />} />
            <Route
              path="onlinegame/:gameType"
              element={<OnlineGame />}
            />
            <Route path="onlinechess" element={<OnlineChess />} />
            <Route path="onlineconnect4" element={<OnlineConnect4 />} />
          </Route>

          {/* admin routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<ManagePlayers />}></Route>
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
