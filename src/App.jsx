import React from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.scss'
import Navbar from './components/Profile/Navbar/Navbar'
import { useAuthentication } from './components/Authentication/Authentication'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {ProtectedRoute, SingIn, Register, Profile, ChangeInfo, PersonalInfo} from './components/index'
import  {  Authentication } from './components/Authentication/Authentication'

import { Outlet } from 'react-router-dom'
import { Fallback } from './components/ErrorBoundary/ErrorBoundary'
import AlertDiv from './components/AlertDiv/AlertDiv'

const NotFound = () =>{
  return (
    <div><h2>NOT FOUND</h2></div>
  )
}

const router = createBrowserRouter([
  {
    element: <NotFound />,
    path: '*',
  },
  {
    element:<ProtectedRoute/>,
    path:'/',
    children:[      
      {
        element: <Navbar />,
        children : [
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

const App = ({}) => {
  const {User,logout,Message,setMessage, Loading} = useAuthentication()
  return (
    <div className='App'>
      {Message?.message ? (
        <AlertDiv message={Message} setMessage={setMessage} logout={logout}/>
      
      ) : (
        Loading ? <Fallback /> : (
          <RouterProvider router={router} />
            ) 
          )
          }
       

    </div>
  )
}

export default App