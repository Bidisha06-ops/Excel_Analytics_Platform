import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>} />
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;
