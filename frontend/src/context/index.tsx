import React from 'react'

import { AuthProvider } from './AuthContext'
import { ToastProvider } from './ToastContext'
import { ThemeProvider } from './ThemeContext'

const AppProvider: React.FC = ({children}) => {
    return(
        <AuthProvider>
            <ToastProvider>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </ToastProvider>
        </AuthProvider>
    )
}

export default AppProvider 