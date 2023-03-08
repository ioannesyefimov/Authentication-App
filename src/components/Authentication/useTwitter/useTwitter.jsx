import React from 'react'
import { useAuthentication } from '../Authentication';


const useTwitter = () => {
 
    const {setCookie,setError,setLoading} = useAuthentication()

    const url = `http://localhost:5050/api/auth/`

    let newURL = location.href.split("?")[0];

    const handleTwitter = ( ) => {

    }
 
    return {handleTwitter}
}

export default useTwitter