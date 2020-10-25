import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import AppProvider from './context'
import { ThemeProvider } from 'styled-components'

import dark from './styles/themes/dark'

import GlobalStyle from './styles/global'

import Routes from './routes'

const App: React.FC = ()=>{
  return(
    <>
      <AppProvider>
        
          <BrowserRouter>
            <Routes/>
          </BrowserRouter>
          <GlobalStyle/>
      </AppProvider>
    </>
  )
}

export default App;
