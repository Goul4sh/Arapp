import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import {AuthProvider} from "./features/auth/AuthProvider.tsx";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCat, faPeopleRoof, faBook, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

library.add(faCat, faPeopleRoof, faBook, faGraduationCap);


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </StrictMode>,
)
