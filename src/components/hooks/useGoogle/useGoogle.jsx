import React, {useEffect} from 'react'
import { useAuthentication } from '../../Authentication/Authentication';
import { APIFetch } from '../../utils/utils';
import useFetch from '../useFetch';

const useGoogle = (loginType) => {
    const {setCookie,setMessage,setLoading, User,logout} = useAuthentication()
    const {handleDelete} = useFetch()
    
    const handleGoogle = (response)=>{
        let loginType = window.localStorage.getItem('LOGIN_TYPE')
        if(!response) return console.log(`MISSING GOOGLE'S RESPONSE `)
        console.log(`type:`, loginType)
        console.log(`RESPONSE: `, response)
        switch(loginType){
            case 'signin': return handleGoogleSignin(response);
            case 'register': return handleGoogleRegister(response);
            case 'delete': return handleGoogleDelete(response);
            default: return console.log(`NOT MATCHED TYPE `)
        }
    }
    useEffect(() => {
        console.log(loginType, `effect google`)
        if(window.google){
            window.localStorage.setItem('LOGIN_TYPE', loginType)
            google.accounts.id.initialize({
                client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
                callback: handleGoogle
            })
            console.log('RENDERING BUTTON')
            google.accounts.id.renderButton(document.getElementById('googleBtn'), {
                shape: "circle",
                type: "icon",
            })
        }
    
        
    }, [handleGoogle,loginType]
    )

    const url = `http://localhost:5050/api/auth/`


    let newURL = location.href.split("?")[0];
    const handleGoogleSignin = async(googleResponse) =>{
        try {
            setLoading(true)

            let response = await APIFetch({url: `${url}google/signin`, method:'POST', body:{credential: googleResponse?.credential, loggedThrough: 'Google'}});
    
    
            if(!response?.success){
                logout()
                setMessage({message: response.message, loggedThrough: response?.loggedThrough})
                return console.log(response?.message)
            }
            console.log(response)
            setCookie("accessToken", response?.data?.accessToken, {path: '/'}, {maxAge : "1200"} );
                localStorage.setItem('LOGIN_TYPE', 'signin')
                localStorage.setItem('LOGGED_THROUGH', 'Google')
                console.log(`GETTING GOOGLE USER `)
        } catch (error) {
            return setMessage({message: error})

        }finally {
            setLoading(false)
        }
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
            let deleteUser = await handleDelete({accessToken: dbResponse?.accessToken, user: User, deletedThrough:'Google'})
            console.log(deleteUser)
            if(!deleteUser?.success){
                return console.log('USER IS NOT DELETED')
            }
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