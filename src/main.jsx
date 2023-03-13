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


const router = createBrowserRouter([
  {
    element:<ProtectedRoute/>,
    children:[
      {
        element: <App/>,
        children: [
          {
            element: <PersonalInfo/>,
            path: '/profile',
            
          },
          {
            element: <ChangeInfo />,
            path: '/profile/change'
          },
        ],
      },
    ],
  },
  {
    element: <Authentication />,
    path: '/',
    children: [
      {
        element: <SingIn/>,
        path: '/auth/signin'
      },
      {
        element: <Register/>,
        path: '/auth/register'
      },
    ]

  },

])



ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>

    <AuthenticationProvider>
      <ThemeProvider>
       <RouterProvider router={router} />

        {/* <App /> */}
      </ThemeProvider>
    </AuthenticationProvider>
  </CookiesProvider>
)
