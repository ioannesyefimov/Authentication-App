import React,{useEffect} from 'react'
import Navbar from './components/Profile/Navbar/Navbar'
import { useAuthentication } from './components/Authentication/Authentication'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {ProtectedRoute, SingIn, Register, ChangeInfo, PersonalInfo, useFetch} from './components/index'
import  {  Authentication } from './components/Authentication/Authentication'
import { Fallback } from './components/ErrorBoundary/ErrorBoundary'
import AlertDiv from './components/AlertDiv/AlertDiv'
import useGithub from './components/hooks/useGithub/useGithub'
import './App.scss'
import Footer from './components/Profile/Footer/Footer'

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
    element: <AlertDiv />,
    children: [

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
        path: '/auth',
        children: [
          {
            element: <SingIn/>,
            path: 'signin'
          },
          {
            element: <Register/>,
            path: 'register'
          },
        ]
    
      },
    ]
  }

])

const App = ({}) => {
  const {cookies,isLogged, setLoading, User, Message,setMessage, Loading,setIsLogged,setUser} = useAuthentication()
  const { getUserData, handleDelete} = useFetch()
  const {handleGithubDelete, getUserDataGH,handleGithubRegister} = useGithub()


  useEffect(
    ()=>{
      const isLoggedUser = cookies.user
       if(isLoggedUser?.fullName ){
        // console.log(`isLoggedUser: `, isLoggedUser)
         setUser(isLoggedUser)
         return setIsLogged(true)
       } 
       let LOGIN_TYPE = localStorage.getItem('LOGIN_TYPE')
       let LOGGED_THROUGH = window.localStorage.getItem('LOGGED_THROUGH')
       const accessToken = cookies?.accessToken
 
       if(!isLogged && !Message?.message){
         if(LOGGED_THROUGH ){
           if(accessToken == 'undefined' || accessToken == undefined ) return  
          const checkAccessToken = async({accessToken})=>{
             try {
                 setLoading(true)
               switch(LOGGED_THROUGH){
                 // check whether user is trying to register github account or signin
                 case 'Github': 
                 if(LOGIN_TYPE =='register'){
                   return await handleGithubRegister(accessToken) 
                 } else if(LOGIN_TYPE =='signin') {
                   return accessToken.includes('gho_') ?
                    await getUserDataGH(accessToken) : await getUserData(accessToken, LOGGED_THROUGH)
                 } 
                 case 'Google':   
                   return await getUserData(accessToken, LOGGED_THROUGH)
                   
                 case 'Internal':
                   return await getUserData(accessToken, LOGGED_THROUGH)
                 case 'Facebook':
                   return await getUserData(accessToken, LOGGED_THROUGH)
                 case 'Twitter': 
                   return  await getUserData(accessToken, LOGGED_THROUGH)
                 default: return
                  //  console.log('not found')
               }
              
           } catch (error) {
             return setMessage({message:error})
           } finally{
             setLoading(false)
           }
          }
          checkAccessToken({ accessToken, user: User}) 
      }
  }
       else if(LOGIN_TYPE == 'delete'){
           let checkDelete =  async()=>{
             switch(LOGGED_THROUGH){
                case 'Github': 
                return await handleGithubDelete({accessToken,user:User});
               case 'Google':   
               return await handleDelete({accessToken,user:User});
               case 'Facebook':
                 return await handleDelete({accessToken,user:User});
               case 'Twitter': 
               return await handleDelete({accessToken,user:User})
               default: 
                 return 
             }
 
           }
           checkDelete()
       }

    }, [cookies?.user, cookies?.accessToken]
  )

  return (
    <div className='App'>
        {Loading ? <Fallback /> : (
          <RouterProvider router={router} />
            )
          }
       
          <Footer />
    </div>
  )
}

export default App