import React from 'react'
import {ProtectedRoute, SingIn, Register, Home} from './components/index'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.scss'

const router = createBrowserRouter([
    {
          
          element:<ProtectedRoute/>,
          path:'/',
          children:[
            {
              element: <Home />,
              path: '/home',
            },
            {
              element: <SingIn/>,
              path: '/auth/signin'
            },
            {
              element: <Register/>,
              path: '/auth/register'
            },
          ],
    },
  ])

const App = () => {
  return (
    <div className='App'>
        <RouterProvider router={router} />
    </div>
  )
}

export default App