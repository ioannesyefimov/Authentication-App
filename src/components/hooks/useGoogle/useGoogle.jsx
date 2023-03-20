import React, {useEffect} from 'react'
import { useAuthentication } from '../../Authentication/Authentication';
import useFetch from '../useFetch';

const useGoogle = (type) => {
    const {setCookie,setMessage,setLoading, User,logout} = useAuthentication()
    const {handleDelete} = useFetch()
    const handleGoogle = (response,type)=>{
        switch(type){
            case 'signin': return handleGoogleSignin(response);
            case 'register': return handleGoogleRegister(response);
            case 'delete': return handleGoogleDelete(response);
            default: return console.log(`NOT MATCHED TYPE `)
        }
    }
    
    useEffect(() => {
        if(window.google){
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
            callback: (response)=> handleGoogle(response, type)
        })
        google.accounts.id.renderButton(document.getElementById('googleBtn'), {
            shape: "circle",
            type: "icon",
        })
        }
    
        
    }, [handleGoogle]
    )

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
            setMessage({message: data.message, loggedThrough: data?.loggedThrough})
            setLoading(false)

            return console.log(data?.message)

        }
        
            setCookie("accessToken", data?.data?.accessToken, {path: '/'}, {maxAge : "1200"} );
            // setCookie('user', userResponse?.data.user, {path:'/'})
            // localStorage.setItem('LOGGED_THROUGH', data?.data?.loggedThrough)
            localStorage.setItem('LOGIN_TYPE', 'signin')
            localStorage.setItem('LOGGED_THROUGH', 'Google')
            setMessage()
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
             setMessage({message:data.message, loggedThrough: data?.loggedThrough})
            return setLoading(false)

        }

        console.log(data)
            let dbResponse = data.data
        
            setCookie('refreshToken', dbResponse?.refreshToken,  {path: '/'}, {maxAge : "1200"})
            
            setCookie("accessToken", dbResponse?.accessToken,  {path: '/'}, {maxAge : "1200"});
            localStorage.setItem('LOGGED_THROUGH', 'Google')
            localStorage.setItem('LOGIN_TYPE', 'register')
        setLoading(false)
        window.location.reload()
    }

    const handleGoogleDelete = async(response) =>{
        try {
            console.log(`DELETING USER GOOGLE`)
            setLoading(true)
            let DBFETCH = await  fetch(`${url}google/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({credential: response.credential, loggedThrough: 'Google'}),
            }
            );
    
            const data = await DBFETCH.json()
            console.log(data)
            if(!data?.success && data?.message){
                console.log(data)
                setMessage({message:data.message, loggedThrough: data?.loggedThrough})
                return setLoading(false)
        
            }
    
            let dbResponse = data.data
            // if(!dbResponse?.accessToken)return setMessage({message:``})
            let deleteUser = await handleDelete({accessToken: dbResponse?.accessToken, user: User})
            console.log(deleteUser)
            logout('/auth/signin')
            // setCookie("accessToken", dbResponse?.accessToken,  {path: '/'}, {maxAge : "1200"});
        
            setLoading(false)
            
        } catch (error) {
            return  setMessage({message:error})

        }
    }

  return {handleGoogleRegister,handleGoogleSignin, handleGoogleDelete,handleGoogle}
}

export default useGoogle