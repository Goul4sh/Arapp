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
import WritingCoursePage from "../features/writing/pages/WritingCoursePage.tsx";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage.tsx";
import ProtectedAdminDashboardLayout from "../common/layouts/ProtectedAdminDashboardLayout.tsx";
import AdminDashboard from "../features/admin/pages/AdminDashboard.tsx";
import TaskManagementPage from "../features/admin/pages/TaskManagementPage.tsx";
import WordBankManagementPage from "../features/admin/pages/WordBankManagementPage.tsx";
import WordBank from "../features/wordBank/pages/WordBank.tsx";
import LessonManagement from "../features/admin/pages/LessonManagement.tsx";
import CompendiumDataManagement from "../features/admin/pages/CompendiumDataManagement.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/*Trasy uzywane do logowania i rejestracji*/}
                <Route path={"/"} element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
                <Route path="/reset-password" element={<ResetPasswordPage/>}/>


                {/*Trasy dostepne po logowaniu, uzywajace widoku dashboard (header)*/}
                <Route element={<ProtectedDashboardLayout/>}>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/review" element={<ReviewPage/>}/>
                    <Route path="/quiz" element={<div>Quiz Page</div>}/>
                    <Route path="/letters" element={<WritingCoursePage/>}/>
                    <Route path="/words" element={<WordBank/>}/>
                    <Route path="/grammar" element={<div>Grammar Page</div>}/>
                    <Route path="/exercises" element={<ExerciseSelector/>}/>
                </Route>

                {/*Trasa pozwalająca na wykonywanie ćwiczeń zależnie od id*/}
                <Route element={<ProtectedExerciseLayout/>}>
                    <Route path="/exercises/:id" element={<ExerciseWrapperPage/>}/>
                    <Route path="/lessons/:lesson_id" element={<ExerciseWrapperPage/>}/>
                </Route>

                <Route element={<ProtectedExerciseLayout/>}>
                    <Route path="/review/:groupId" element={<ReviewPracticePage/>}/>
                </Route>

                {/*Trasy tylko dla administratora*/}
                <Route element={<ProtectedAdminDashboardLayout/>}>
                    <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
                    <Route path="/admin/content" element={<TaskManagementPage/>}/>
                    <Route path="/admin/course" element={<LessonManagement/>}/>
                    <Route path="/admin/words" element={<WordBankManagementPage/>}/>
                    <Route path="/admin/compendium" element={<CompendiumDataManagement/>}/>

                </Route>

                <Route path={"*"} element={<Navigate to="/" replace/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App
