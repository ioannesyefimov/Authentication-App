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
  const {cookies,isLogged, setLoading, User, Message,setMessage, Loading,Reload} = useAuthentication()
  const { getUserData, handleDelete} = useFetch()
  const {getGithubAccessToken,handleGithubDelete, getUserDataGH,handleGithubRegister} = useGithub()

  useEffect(() => {
    let accessToken = cookies.accessToken
    console.log(`token: ${accessToken}`);
    console.log(`rerendered`);


    
    if(!isLogged ){
       const checkQueryString = async() => {
          try {
            setLoading(true)
            let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
            let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
            console.log(`query loading started`);
              const queryString = window.location.search
              const urlParams = new URLSearchParams(queryString)
              const codeParam = urlParams.get('code')
                if(codeParam && LOGGED_THROUGH == 'Github' ) {
                return await getGithubAccessToken(codeParam, LOGIN_TYPE);
              } else {
                return console.log('query is empty')
              }
          } catch (error) {
            return setMessage({message:error})
  
          } finally{
            setLoading(false)
          }
          }
      checkQueryString()
        }
  }, [])

  useEffect(
    ()=>{
      let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
      let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
      const accessToken = cookies?.accessToken

      if(!isLogged){
        const checkAccessToken = async({accessToken})=>{
          if(accessToken == 'undefined' || accessToken == undefined ) return console.log('TOKEN IS ', accessToken)
          
          try {
            setLoading(true)
    
            console.log(`token loading started`);
            console.log(`logintype:`, LOGIN_TYPE)
            console.log(`loggedThrough:`, LOGGED_THROUGH)
            console.log("token: ",accessToken);
            if(LOGGED_THROUGH ){
              switch(LOGGED_THROUGH){
                // check whether user is trying to register github account or signin
                case 'Github': 
                if(LOGIN_TYPE =='register'){
                   await handleGithubRegister(accessToken) 
                } else if(LOGIN_TYPE =='signin') {
                  return accessToken.includes('gho_') ?
                   await getUserDataGH(accessToken) : await getUserData(accessToken, LOGGED_THROUGH)
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
              } else {
                return console.log(`LOGGED THROUGH NOT_FOUND`)
              }
          } catch (error) {
            return setMessage({message:error})
          } finally{
            setLoading(false)
          }
          }
        checkAccessToken({ accessToken, user: User})
          return console.log(`CHECKING TOKEN`);
      }

      else if(LOGIN_TYPE == 'delete'){
          let checkDelete =  async()=>{
            switch(LOGGED_THROUGH){
               case 'Github': 
                   await handleGithubDelete({accessToken,user:User});
                  break;
              case 'Google':   
                 await handleDelete({accessToken,user:User});
                 break;
              case 'Facebook':
                 await handleDelete({accessToken,user:User});
                break;
              case 'Twitter': 
               await handleDelete({accessToken,user:User})
              break;
              default: 
                console.log('not found')
            }

          }
          checkDelete()
          return console.log(`CHECKING delete`);


      }
    
    },[cookies?.accessToken]
  )


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