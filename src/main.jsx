import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import './components/utils/css-reset.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {ProtectedRoute, SingIn, Register, Profile, ChangeInfo, PersonalInfo} from './components/index'

import ThemeProvider from './components/Authentication/ThemeProvider/ThemeProvider'
import  { AuthenticationProvider, Authentication } from './components/Authentication/Authentication'

import {CookiesProvider} from 'react-cookie'
import App from './App'
import ErrorBoundary, { Fallback } from './components/ErrorBoundary/ErrorBoundary'


ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary fallback={<Fallback/>}>
  <CookiesProvider>

    <AuthenticationProvider>
      <ThemeProvider>

        <App />
      </ThemeProvider>
    </AuthenticationProvider>
  </CookiesProvider>
  </ErrorBoundary>
)
