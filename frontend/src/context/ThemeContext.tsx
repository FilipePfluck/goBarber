import React, {createContext, useCallback, useState, useContext, useEffect} from 'react'

import { ThemeProvider as StyledProvider, DefaultTheme } from 'styled-components'

import api from '../services/apiClient'

import dark from '../styles/themes/dark'
import light from '../styles/themes/light'


interface ThemeContextData {
    theme: DefaultTheme,
    toggleTheme():void
}

export const ThemeContext = createContext({} as ThemeContextData)

export const ThemeProvider:React.FC = ({children}) => {

    const [theme, setTheme] = useState<DefaultTheme>(()=>{
        const storageValue = localStorage.getItem('@gobarber:theme')

        if(storageValue) {
            return JSON.parse(storageValue)
        }

        return dark
    })

    const toggleTheme = useCallback(()=>{
        setTheme(state => state.title === 'dark' ? light : dark)
    },[])

    useEffect(()=>{
        localStorage.setItem('@gobarber:theme', JSON.stringify(theme))
    },[theme])

    return(
        <StyledProvider theme={theme as DefaultTheme}>
            <ThemeContext.Provider value={{theme, toggleTheme}}>
                {children}          
            </ThemeContext.Provider>
        </StyledProvider>
    )
}

export function useTheme(): ThemeContextData {
    const context = useContext(ThemeContext)

    if(!context){
        throw new Error('useTheme must be used within an ThemeProvider')
    }

    return context
}

