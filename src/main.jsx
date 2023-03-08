import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import './components/utils/css-reset.scss'

import ThemeProvider from './components/Authentication/ThemeProvider/ThemeProvider'
import  { AuthenticationProvider } from './components/Authentication/Authentication'

import {CookiesProvider} from 'react-cookie'
import App from './App'



ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>

    <AuthenticationProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthenticationProvider>
  </CookiesProvider>
)
