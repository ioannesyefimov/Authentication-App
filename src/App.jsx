import React from 'react'
import {ProtectedRoute, SingIn, Register, Profile} from './components/index'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.scss'
import ChangeInfo from './components/Home/ChangeInfo/ChangeInfo'

const router = createBrowserRouter([
    {
          
          element:<ProtectedRoute/>,
          path:'/',
          children:[
            {
              element: <Profile />,
              path: '/profile',
             
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