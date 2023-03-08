import { useAuthentication } from './Authentication'
import useGithub from './useGithub/useGithub'
// 
const useFetch = () => {

    const {setCookie, setError,setLoading,removeCookie} = useAuthentication()
    // const {getGithubAccessToken} = useGithub()
    const url = `http://localhost:5050/api/auth/`
    let newURL = location.href.split("?")[0];

    
    const checkQueryString = async({LOGIN_TYPE, LOGGED_THROUGH,getGithubAccessToken}) => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const codeParam = urlParams.get('code')
  
          if(codeParam && LOGGED_THROUGH == 'Github' ) {
           await getGithubAccessToken(codeParam, LOGIN_TYPE)
        } else {
          return console.log('query is empty')
        }
      }
      const checkAccessToken = async({LOGIN_TYPE, LOGGED_THROUGH, accessToken,handleGithubRegister,getUserData,getUserDataGH})=>{
        console.log(LOGIN_TYPE)
        console.log(LOGGED_THROUGH)
        console.log(accessToken)
        if(accessToken && LOGGED_THROUGH ){
            
              switch(LOGGED_THROUGH){
                // check whether user is trying to register github account or signin
                case 'Github': return LOGIN_TYPE=='register' ? await handleGithubRegister(accessToken,'register') : await getUserDataGH()
                case 'Google': return  await getUserData(accessToken, LOGGED_THROUGH)
                case 'Internal': return await getUserData(accessToken, LOGGED_THROUGH)
                case 'Facebook': return await getUserData(accessToken, LOGGED_THROUGH)
                case 'Twitter': return await getUserData(accessToken, LOGGED_THROUGH)
                default: return console.log('not found')
              }
          } else {
            return console.log(`NOT_FOUND`)
          }
        }

    const fetchRegister = async (fullNameRef,passwordRef,emailRef) => {
        setLoading(true)

        const APICALL = await fetch('http://localhost:5050/api/auth/register', {
      method: "POST",
      headers:{
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        fullName: fullNameRef.current.value,
        password: passwordRef.current.value,
        email: emailRef.current.value,
        loggedThrough: 'Internal'
      })})
    
    const response = await APICALL.json()

    console.log(response)

    if(!response.success ) {
      if(response?.loggedThrough ){
        return setError({message:response.message, loggedThrough: response?.loggedThrough})
      } 
    } 
      setCookie('accessToken', response.data.accessToken, {path: '/'})
      setCookie('refreshToken', response.data.refreshToken, {path: '/'})

      localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
    (response.data?.loggedThrough)

    window.location.reload()
    
    setLoading(false)
    }

    const fetchSignin = async (emailRef,passwordRef) => {
        setLoading(true)


        const USER = await fetch(`${url}/auth/signin`, {
            method: "POST",
            headers:{
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: emailRef.current.value,
              password: passwordRef.current.value,
              loggedThrough: 'Internal'
            })    
          })
          console.log(USER)
          const response = await USER.json()
      
          if(!response.success ) {
              return setError({message:response.message, loggedThrough: response?.loggedThrough})
          } else if(response.success){
            setUser(response.data.user)
            setCookie('accessToken', response.data.accessToken, {path: '/'})
            localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
          }
        window.location.reload()

          setLoading(false)

    }

   const getUserData= async(accessToken, loggedThrough) =>{
    setLoading(true)

       const dbResponse = await fetch(`${url}signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            accessToken: accessToken,
            loggedThrough: loggedThrough
        }),
        })
        const response = await dbResponse.json()

        if(!response?.success && response.message){
            return setError({message:response.message, loggedThrough:response?.loggedThrough})
        }
        if(response?.data.user){

            const user = {
                fullName: response?.data.user.fullName,
                email: response?.data.user.email,
                picture: response?.data.user.picture,
            }

            console.log(response)
            localStorage.setItem('LOGGED_THROUGH', response?.loggedThrough)
            console.log(`GETTING USER `)
            setCookie('user',user , {path:'/'})
            removeCookie('accessToken', {path:'/'})
            
            window.localStorage.clear()
        }

        setLoading(false)

   }

   
  

   

   return { getUserData, fetchSignin,fetchRegister,checkAccessToken,checkQueryString
    }
}

export default useFetch