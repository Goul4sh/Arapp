import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Signup from '../features/auth/pages/Signup';
import Login from "../features/auth/pages/Login.tsx";
import Home from "../features/home/pages/Home.tsx";
import Dashboard from "../features/home/pages/Dashboard.tsx";

import ReviewPage from "../features/review/pages/ReviewPage.tsx";
import ProtectedDashboardLayout from '../common/layouts/ProtectedDashboardLayout';
import ExerciseSelector from "../features/exercises/pages/ExerciseSelector.tsx";
import ProtectedExerciseLayout from "../common/layouts/ProtectedExerciseLayout.tsx";
import ExerciseWrapperPage from "../features/exercises/pages/ExerciseWrapperPage.tsx";
import ReviewPracticePage from "../features/review/pages/ReviewPracticePage.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/*Trasy uzywane do logowania i rejestracji*/}
                <Route path={"/"} element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>

                {/*Trasy dostepne po logowaniu, uzywajace widoku dashboard (header)*/}
                <Route element={<ProtectedDashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/review" element={<ReviewPage />} />
                    <Route path="/quiz" element={<div>Quiz Page</div>} />
                    <Route path="/letters" element={<div>Arabic symbols</div>} />
                    <Route path="/words" element={<div>Some words</div>} />
                    <Route path="/grammar" element={<div>Grammar Page</div>} />
                    <Route path="/exercises" element={<ExerciseSelector/>} />
                </Route>

                {/*Trasa pozwalająca na wykonywanie ćwiczeń zależnie od id*/}
                <Route element={<ProtectedExerciseLayout/>}>
                    <Route path="/exercises/:id" element={<ExerciseWrapperPage/>} />
                    <Route path="/lessons/:lesson_id" element={<ExerciseWrapperPage/>} />
                </Route>

                <Route element={<ProtectedExerciseLayout />}>
                    <Route path="/review/:groupId" element={<ReviewPracticePage/>} />
                </Route>

                <Route path={"*"} element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App
