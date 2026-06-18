import { createContext, use } from "react";
import { useState } from "react";
/* Crea el contexto */

export const ThemeContext = createContext();

function ThemeContextProvider({children}) {
    
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <ThemeContext.Provider 
            value={
                {
                    isDarkMode: isDarkMode,
                }
            }
        >
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider;