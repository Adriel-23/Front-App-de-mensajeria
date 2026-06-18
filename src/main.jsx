import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import ThemeContextProvider from './Context/ThemeContext.jsx'
import AuthContextProvider from './Context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <ThemeContextProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </ThemeContextProvider>
    </BrowserRouter>
)