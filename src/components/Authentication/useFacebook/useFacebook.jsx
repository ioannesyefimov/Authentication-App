import React from 'react'
import { useAuthentication } from '../Authentication';

const useFacebook = () => {
    const {setCookie,setError,setLoading} = useAuthentication()

    const url = `http://localhost:5050/api/auth/`

    let newURL = location.href.split("?")[0];
    
    const handleFacebook = () => {

    }


    return {handleFacebook}
}

export default useFacebook