import React from 'react'
import { useAuthentication } from '../Authentication';

const useGoogle = () => {
    const {setCookie,setError,setLoading} = useAuthentication()

    const url = `http://localhost:5050/api/auth/`

    let newURL = location.href.split("?")[0];
    const handleGoogleSignin = async(response) =>{
        setLoading(true)
        response = await   fetch(`${url}google/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({credential: response.credential, loggedThrough: 'Google'}),
            })
        
        const data = await response.json()

        if(!data?.success){
            setError({message: data.message, loggedThrough: data?.loggedThrough})
            return console.log(data?.message)

        }
            setCookie("accessToken", data?.data?.accessToken,  {path: '/'});
            // setCookie('user', userResponse?.data.user, {path:'/'})
            // localStorage.setItem('LOGGED_THROUGH', data?.data?.loggedThrough)
            localStorage.setItem('LOGIN_TYPE', 'signin')
            localStorage.setItem('LOGGED_THROUGH', 'Google')
            setError()
            console.log(`GETTING GOOGLE USER `)
           
            
        setLoading(false)
        window.location.reload()

    }

    const handleGoogleRegister = async (response) => {
        setLoading(true)
            response = await   fetch(`${url}google/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({credential: response.credential}),
            }
            )

        const data = await response.json()

        if(!data?.success && data?.message){
            console.log(data)
             setError({message:data.message, loggedThrough: data?.loggedThrough})
            return setLoading(false)

        }

        console.log(data)
            let dbResponse = data.data
        
            setCookie('refreshToken', dbResponse?.refreshToken)
            
            setCookie("accessToken", dbResponse?.accessToken,  {path: '/'});
            localStorage.setItem('LOGGED_THROUGH', 'Google')
            localStorage.setItem('LOGIN_TYPE', 'register')
        setLoading(false)
        window.location.reload()
    }

    

  return {handleGoogleRegister,handleGoogleSignin}
}

export default useGoogle