import React from 'react'
import {ProtectedRoute, SingIn, Register, Profile, ChangeInfo, PersonalInfo} from './components/index'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.scss'
import Navbar from './components/Profile/Navbar/Navbar'
import { useAuthentication } from './components/Authentication/Authentication'
import { Outlet } from 'react-router-dom'
// const router = createBrowserRouter([
//     {
          
//           element:<ProtectedRoute/>,
//           path:'/',
//           children:[
//             {
//               element: <Navbar/>,
//             },
//             {
//               element: <PersonalInfo/>,
//               path: '/profile',
             
//             },
//             {
//               element: <ChangeInfo />,
//               path: '/profile/change'
//             },
        
//             {
//               element: <SingIn/>,
//               path: '/auth/signin'
//             },
//             {
//               element: <Register/>,
//               path: '/auth/register'
//             },
//           ],
//     },
//   ])

const App = ({}) => {
  const {User} = useAuthentication()
  return (
    <div className='App'>
      {User?.fullName && !window.location.pathname.includes('/auth') ? ( <Navbar/>) : (null)}
        <Outlet />
    </div>
  )
}

export default App