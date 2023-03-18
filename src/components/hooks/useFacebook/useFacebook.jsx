import React from 'react'
import { useAuthentication } from '../../Authentication/Authentication';

const useFacebook = () => {
    const {setCookie,setError,setLoading} = useAuthentication()

    const url = `http://localhost:5050/api/auth/`

    let newURL = location.href.split("?")[0];
    
    const handleFacebook = () => {

    }
    const handleFacebookDelete = async()=>{
        console.log(`deleting facebok`)
    }


    return {handleFacebookDelete, handleFacebook}
}

export default useFacebook