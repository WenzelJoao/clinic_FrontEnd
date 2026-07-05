/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark")

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const nextTheme = !prev

            if (nextTheme) {
                localStorage.setItem("theme", "dark")
            } else {
                localStorage.setItem("theme", "light")
            }

            return nextTheme
        })
    }

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
