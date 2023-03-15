import { useAuthentication } from '../Authentication/Authentication'
import { APIFetch } from '../utils/utils';
import { convertBase64 } from '../utils/utils';
// 
const useFetch = () => {

    const {setCookie, setMessage,setLoading,removeCookie,setIsLogged} = useAuthentication()
    // const {getGithubAccessToken} = useGithub()
    const url = `http://localhost:5050/api/`
    let newURL = location.href.split("?")[0];

    
    const checkQueryString = async({LOGIN_TYPE, LOGGED_THROUGH,getGithubAccessToken}) => {
      setLoading(true)
      console.log(`query loading started`);

        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const codeParam = urlParams.get('code')
  
          if(codeParam && LOGGED_THROUGH == 'Github' ) {
            setLoading(false)
          return await getGithubAccessToken(codeParam, LOGIN_TYPE);
        } else {
          setLoading(false)
          return console.log('query is empty')
        }

      }
      const checkAccessToken = async({LOGIN_TYPE, LOGGED_THROUGH, accessToken,handleGithubRegister,getUserData,getUserDataGH})=>{
        setLoading(true)
        console.log(`token loading started`);
      
        if(accessToken && LOGGED_THROUGH ){
          switch(LOGGED_THROUGH){
            // check whether user is trying to register github account or signin
            case 'Github': 
             LOGIN_TYPE=='register' ?
              await handleGithubRegister(accessToken,'register') :
               await getUserDataGH();
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
          setLoading(false)
            
          } else {
            setLoading(false)
            return console.log(`NOT_FOUND`)
          }
          
        }

    const fetchRegister = async (fullNameRef,passwordRef,emailRef) => {
        setLoading(true)

        const response = await APIFetch({
          url:`${url}auth/register`, 
          method:'POST',
          body: { 
          fullName: fullNameRef.current.value,
          password: passwordRef.current.value,
          email: emailRef.current.value,
          loggedThrough: 'Internal'
        }})
      
       
    

    console.log(response)

    if(!response.success ) {
      if(response?.loggedThrough ){
         setMessage({message:response.message, loggedThrough: response?.loggedThrough})
      } 
    } 
      setCookie('accessToken', response.data.accessToken, {path: '/', maxAge: 2000})
      setCookie('refreshToken', response.data.refreshToken, {path: '/', maxAge: 2000})

      localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
    (response.data?.loggedThrough)

    
    setLoading(false)
    }

    const fetchSignin = async (emailRef,passwordRef) => {
        setLoading(true)


        const response = await APIFetch({

         url: `${url}auth/signin`, 
         method: 'POST', 
         body: {
          email: emailRef.current.value,
          password: passwordRef.current.value,
          loggedThrough: 'Internal'
        }}) 
           
      
          if(!response.success ) {
             setLoading(false)
               setMessage({message:response?.message, loggedThrough: response?.loggedThrough})
          } else if(response.success){
            // setCookie('user',response.data.user, {path: '/', maxAge: '2000'})
            setCookie('accessToken', response.data.accessToken, {path: '/', maxAge: 2000})
            localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
            window.location.reload()
          }
        // window.location.reload()

          setLoading(false)

    }

   const getUserData= async(accessToken, loggedThrough) =>{
    setLoading(true)

       const response = await APIFetch({
        url: `${url}auth/signin`,
        method: 'POST', 
        body: {
        accessToken: accessToken,
        loggedThrough: loggedThrough
        }})

        if(!response?.success && response.message){
             setMessage({message:response.message, loggedThrough:response?.loggedThrough})
        }
        console.log(response)
        if(response?.data.user){

            const user = {
                fullName: response?.data.user.fullName,
                email: response?.data.user.email,
                picture: response?.data.user.picture,
                bio: response?.data.user?.bio,
                phone: response?.data.user?.phone,
            }

            console.log(response)
            localStorage.setItem('LOGGED_THROUGH', response?.loggedThrough)
            console.log(`GETTING USER `)

            setCookie('user',user ,{path: '/', maxAge: 2000})
            // setCookie('accessToken', response?.data?.accessToken,{path: '/', maxAge: 2000})
            // removeCookie('accessToken', {path:'/'})
//             removeCookie('accessToken', {path:'/auth'})
            setIsLogged(true)
            window.localStorage.clear()
            // window.location.reload()
        }

        setLoading(false)

   }

   const handleFetchType = async(updatedParams, email, token,setMessage) =>{
    return await APIFetch({
      url:`${url}change`, 
      method: 'POST',
      body:{userEmail: email, updatedParams: updatedParams, accessToken: token}
    })
    
    
  }
  const uploadPicture = async (file,accessToken) => {
   
    // const file = event.target.files[0]
    const base64 = await convertBase64(file)
    

        // 👇 Uploading the file using the fetch API to the server
     const upload = await fetch('http://localhost:5050/api/upload/picture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            image: base64,
            accessToken: accessToken
          }),
        })

      const uploadResponse = await upload.json()
        return uploadResponse?.success ? (
          {url: uploadResponse?.data?.url}
        ) : (
          {message: uploadResponse?.message}
        )

    }

   const handleChangeFetch = async ({data,user, accessToken}) => {
    // console.log(user);
    let email = data?.get('email')
    let fullName = data?.get('name')
    let bio = data?.get('bio')
    let phone = data?.get('phone')
    let password = data?.get('password')
    let picture = data?.get('picture')
    let changesArr={}

    try {
     setLoading(true)

      if(picture){
        let url = await uploadPicture(picture,accessToken)
        if(url?.message) {
          setLoading(false)
  
          return setMessage({message:url?.message})
        }
        changesArr.picture = url?.url
      }
      if(email) changesArr.email = email
      if(fullName) changesArr.fullName = fullName
      if(bio) changesArr.bio = bio
      if(phone) changesArr.phone = phone
      if(password) changesArr.password = password
      
      let response = await handleFetchType(changesArr, user?.email, accessToken, setMessage);

      console.log(response);
      if(!response?.success) {
        setLoading(false)
        return setMessage({message: response?.message})
      };
      if(!response?.data?.accessToken){
        setLoading(false)

        return setMessage({message:response?.message})  
      }
      setCookie('accessToken', response?.data?.accessToken, {path:'/', maxAge: 2000})
      setMessage({message: response?.data?.message});
      let updatedUser = await getUserData(response?.data?.accessToken);
      console.log(updatedUser)

    } catch (error) {
      setLoading(true)
      return setMessage({message:error})      
    }
  }
   return { getUserData, fetchSignin,fetchRegister,checkAccessToken,checkQueryString,handleChangeFetch,
    }
}

export default useFetch