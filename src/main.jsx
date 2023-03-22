import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import './components/utils/css-reset.scss'

import ThemeProvider from './components/Authentication/ThemeProvider/ThemeProvider'
import  { AuthenticationProvider } from './components/Authentication/Authentication'

import {CookiesProvider} from 'react-cookie'
import App from './App'
import ErrorBoundary, {ErrorFallBack } from './components/ErrorBoundary/ErrorBoundary'


ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary fallback={<ErrorFallBack/>}>
  <CookiesProvider>
    <AuthenticationProvider>
      <ThemeProvider>
      <StrictMode>
        <App />
      </StrictMode>
      </ThemeProvider>
    </AuthenticationProvider>
  </CookiesProvider>
  </ErrorBoundary>
)
