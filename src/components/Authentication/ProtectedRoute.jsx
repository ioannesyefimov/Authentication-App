import React, {useEffect, useState} from 'react'
import { Outlet, useLocation, Navigate} from 'react-router-dom'
import { useAuthentication } from './Authentication'
import useFetch from '../hooks/useFetch'
import useGithub from '../hooks/useGithub/useGithub'
import { timeout } from '../utils/utils'
import { useNavigate } from 'react-router-dom'
import { Fallback } from '../ErrorBoundary/ErrorBoundary'
const ProtectedRoute =  () => {
    const {Loading,isLogged} =  useAuthentication();
   
    const navigate = useNavigate()
 

    const location = useLocation()

    if(Loading ){
      return <Fallback />
    } 
    if(isLogged){

      switch(location.pathname){
        case '/': return <Navigate to='/profile' replace />
        case '/profile': return <Outlet/>
        case '/profile/change': return <Outlet />
      }
    }   else {
     return<Navigate to='/auth/signin' replace />
    }

}

export default ProtectedRoute