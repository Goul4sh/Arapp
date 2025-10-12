import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Signup from '../features/auth/pages/Signup';

import './App.css'
import Login from "../features/auth/pages/Login.tsx";

function App() {
    return (
        <BrowserRouter>
            <h1 className={"title"}>ArAppka</h1>
            <div className="auth_buttons">
                <h2 className="auth_text">Aby rozpocząć przygodę z Arappką zaloguj się lub zarejestruj.</h2>
                <div className={"buttons"}>
                    <Link className="login" to="/login">
                        Login
                    </Link>
                    <Link className="signup" to="/signup">
                        Sign Up
                    </Link>
                </div>
            </div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
