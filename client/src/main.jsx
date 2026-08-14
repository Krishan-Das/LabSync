import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LoaderProvider } from './context/LoaderContext.jsx';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeProvider>
            <AuthProvider>
                <Toaster position="top-center" reverseOrder={false} />
                <LoaderProvider>
                    <App />
                </LoaderProvider>
            </AuthProvider>
        </ThemeProvider>
    </BrowserRouter>
)
