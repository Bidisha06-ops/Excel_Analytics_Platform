import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/login';
import Home from './pages/Home';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
          <Route path="/adminpanel" element={<AdminPanel/>} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
