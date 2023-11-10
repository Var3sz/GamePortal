import '../src/css-files/styles.css'
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Chess from './pages/Chess';
import Connect4 from "./pages/Connect4"
import AppNavbar from './components/AppNavbar';
import { Route, Routes } from 'react-router-dom';
import { ManagePlayers } from './pages/ManagePlayers';
import OnlineChess from './pages/OnlineChess';
import OnlineConnect4 from './pages/OnlineConnect4';
import Layout from './Layout';
import RequireAuth from './auth/RequireAuth';
import Unauthorized from './pages/Unauthorized';

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

          {/* player routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Player]} />}>
            <Route path="chess" element={<Chess />}></Route>í
            <Route path="connect4" element={<Connect4 />}></Route>
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
