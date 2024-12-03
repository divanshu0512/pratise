import './App.css';
import { Box, Typography } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CardOrder from './pages/CardOrder';
import Topup from './pages/Topup';
import NsdlCardOrder from './pages/NsdlCardOrder';
import Report from './pages/Report';
import ValidateUser from './pages/ValidateUser';
import MakerProfile from './pages/MakerProfile';
import AddBalance from './pages/AddBalance';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter basename='/makerui' >
      <Routes>
        <Route path='/' element={ <Login /> } />
        <Route path="/validate" element={ <ValidateUser/> } />
        <Route path='/dashboard' element={ <Dashboard /> } />
        <Route path="/addbalance" element={ <AddBalance/> } />
        <Route path='/uploadcard' element={ <CardOrder /> } />
        <Route path="/topup" element={<Topup/> } />
        <Route path="/makerCard" element={<NsdlCardOrder/> } />
        <Route path="/makerProfile" element={ <MakerProfile/> } />
        <Route path="/report" element={ <Report/> } />
        <Route path="*" element={ <NotFound/> } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
