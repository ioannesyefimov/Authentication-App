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
            // removeCookie('accessToken', {path:'/'})
//             removeCookie('accessToken', {path:'/auth'})
            setIsLogged(true)
            window.localStorage.clear()
        }

        setLoading(false)

   }

   const handleFetchType = async(updatedParams, email, token,setMessage) =>{
    let response = await APIFetch({
      url:`${url}change`, 
      method: 'POST',
      body:{userEmail: email, updatedParams: updatedParams, accessToken: token}
    })
    console.log(`email changing`);
    if(!response?.success){
       setMessage({...message, message:response?.message})
       
    } 
    
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
    setLoading(true)
    // console.log(user);
    let email = data?.get('email')
    let name = data?.get('name')
    let bio = data?.get('bio')
    let phone = data?.get('phone')
    let password = data?.get('password')
    let picture = data?.get('picture')
    console.log(picture);
    let changesArr={}

    if(picture){
      let url = await uploadPicture(picture,accessToken)
      if(url?.message) return setMessage({message:url?.message})
      changesArr.picture = url?.url
    }
    if(email) changesArr.email = email
    if(name) changesArr.name = name
    if(bio) changesArr.bio = bio
    if(phone) changesArr.phone = phone
    if(password) changesArr.password = password
    console.log(changesArr);
    let response = await handleFetchType(changesArr, user?.email, accessToken, setMessage)
    console.log(response);
    if(!response?.success) {
        return setMessage({message: response?.message})
    }
      let newUser =  await getUserData(accessToken)

      console.log(newUser)
      // window.location.reload()
    // if(picture) changesArr.push('picture')
    // if(email) changesArr.push(`email`)
    // if(name) changesArr.push(`name`)
    // if(bio) changesArr.push(`bio`)
    // if(phone) changesArr.push(`phone`)
    // if(password) changesArr.push(`password`)

    // for (let key in changesArr){
    //   switch(changesArr[key]){
    //     case 'email': 
    //       handleFetchType(email, user?.email, accessToken, 'email');
    //       console.log(changesArr[key]);
    //       continue
    //     case 'name': 
    //       handleFetchType(name, user?.email, accessToken, 'name') ;
    //       console.log(changesArr[key]);
    //       continue
    //     case 'phone': 
    //       handleFetchType(phone, user?.email, accessToken, 'phone') ;
    //       console.log(changesArr[key]);
    //       continue
    //     case 'bio':
    //        handleFetchType(bio, user?.email, accessToken, 'bio') ;
    //        console.log(changesArr[key]);
    //        continue
    //     case 'picture':
    //       changePhoto(picture, user, accessToken)
    //       console.log(changesArr[key])
    //       continue
    //     case 'password': 
    //       handleFetchType(password, user?.email, accessToken, 'password') ;
    //       break
    //       default: 
    //         haveMatched = false
    //   }

    
  
    }
    

   
  

   

   return { getUserData, fetchSignin,fetchRegister,checkAccessToken,checkQueryString,handleChangeFetch,
    }
}

export default useFetch