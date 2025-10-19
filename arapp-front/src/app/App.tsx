import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from '../features/auth/pages/Signup';
import Login from "../features/auth/pages/Login.tsx";
import Home from "../features/home/pages/Home.tsx";
import './App.css'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path={"*"} element={<Navigate to="/" replace/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
