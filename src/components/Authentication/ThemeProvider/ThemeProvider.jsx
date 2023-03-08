import React, { useState, useEffect, useContext, useMemo} from 'react'
export const ThemeContext = React.createContext()
import "./Themes.scss"
export function useTheme() {
    return useContext(ThemeContext)
}

const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState('light')

    useEffect(
        ()=>{
            document.querySelector('body').setAttribute('theme', theme)
        },[theme]
    )

    const value = useMemo(
        () => ({
            theme,
            setTheme
        }),
        [theme]
    )

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    ) 
}




export default ThemeProvider