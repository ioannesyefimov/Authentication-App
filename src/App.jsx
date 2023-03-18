import React,{useEffect} from 'react'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.scss'
import Navbar from './components/Profile/Navbar/Navbar'
import { useAuthentication } from './components/Authentication/Authentication'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {ProtectedRoute, SingIn, Register, Profile, ChangeInfo, PersonalInfo, useFetch} from './components/index'
import  {  Authentication } from './components/Authentication/Authentication'

import { Outlet } from 'react-router-dom'
import { Fallback } from './components/ErrorBoundary/ErrorBoundary'
import AlertDiv from './components/AlertDiv/AlertDiv'
import useGithub from './components/hooks/useGithub/useGithub'

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
    // path:'/profile',
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
  const {cookies,isLogged, setLoading, User, Message, Loading,reload} = useAuthentication()
  const { getUserData} = useFetch()
  const {getGithubAccessToken,handleGithubDelete, getUserDataGH,handleGithubRegister} = useGithub()

  useEffect(() => {
    let accessToken = cookies.accessToken
    console.log(`token: ${accessToken}`);
    console.log(`rerendered`);
    let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
    let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
    if(!isLogged && !Message?.message ){
      const checkQueryString = async({LOGIN_TYPE, LOGGED_THROUGH,}) => {
        console.log(`query loading started`);
          const queryString = window.location.search
          const urlParams = new URLSearchParams(queryString)
          const codeParam = urlParams.get('code')
            if(codeParam && LOGGED_THROUGH == 'Github' ) {
            return await getGithubAccessToken(codeParam, LOGIN_TYPE);
          } else {
            return console.log('query is empty')
          }
  
        }
      const checkAccessToken = async({LOGIN_TYPE, LOGGED_THROUGH, accessToken})=>{
        setLoading(true)

        try {
          setLoading(true)
          console.log(`token loading started`);
          console.log(`logintype:`, LOGIN_TYPE)
          console.log(`loggedThrough:`, LOGGED_THROUGH)
          console.log("token: ",accessToken);
          if(accessToken === 'undefined' || undefined ) return console.log('TOKEN IS ', accessToken)
          if(LOGGED_THROUGH ){
            switch(LOGGED_THROUGH){
              // check whether user is trying to register github account or signin
              case 'Github': 
              if(LOGIN_TYPE =='register'){
                await handleGithubRegister(accessToken) 
              } else if(LOGIN_TYPE =='signin') {
                await getUserDataGH();
              } else if (LOGIN_TYPE === 'delete'){
                await handleGithubDelete({accessToken, user: User})
              }
                  break;
              case 'Google':   
                await getUserData(accessToken, LOGGED_THROUGH)
                break;
              case 'Internal':
                await getUserData(accessToken, LOGGED_THROUGH)
                break;
              case 'Facebook':
                await getUserData(accessToken, LOGGED_THROUGH)
                break;
              case 'Twitter': 
                await getUserData(accessToken, LOGGED_THROUGH)
                break;
              default: 
                console.log('not found')
            }
            setLoading(false)
            } else {
              setLoading(false)
              return console.log(`NOT_FOUND`)
            }
            
          
        } catch (error) {
          return setMessage({message:error})
        } finally{
          setLoading(false)
        }
      
        }
      console.log(`isn't logged`);
      checkQueryString({LOGIN_TYPE, LOGGED_THROUGH})
      if(accessToken == 'undefined' || accessToken == undefined) return console.log('accessToken is' , accessToken) 
      checkAccessToken({LOGIN_TYPE, LOGGED_THROUGH, accessToken})
    }

  }, [reload])


  return (
    <div className='App'>
     
        {Loading ? <Fallback /> : (
          <RouterProvider router={router} />
            )
          }
          {!Loading && Message?.message ? 
            (
             <AlertDiv />
            )
             :
            (null)
          }
       

    </div>
  )
}

export default App