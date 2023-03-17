import { useAuthentication } from '../Authentication/Authentication'
import { APIFetch, Errors } from '../utils/utils';
import { convertBase64 } from '../utils/utils';
// 
const useFetch = () => {

    const {setCookie, setMessage,setLoading,removeCookie,setIsLogged, logout} = useAuthentication()
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
        console.log(`logintype:`, LOGIN_TYPE)
        console.log(`loggedThrough:`, LOGGED_THROUGH)
        console.log("token: ",accessToken);
        if(accessToken !== 'undefined' && LOGGED_THROUGH ){
          switch(LOGGED_THROUGH){
            // check whether user is trying to register github account or signin
            case 'Github': 
            if(LOGIN_TYPE =='register'){
              await handleGithubRegister(accessToken) 
            } else if(LOGIN_TYPE =='signin') {
              await getUserDataGH();
            }
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
             return  setMessage({message:response?.message, loggedThrough: response?.loggedThrough})
          } 
            // setCookie('user',response.data.user, {path: '/', maxAge: '2000'})
            setCookie('accessToken', response.data.accessToken, {path: '/', maxAge: 2000})
            localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)

          setLoading(false)

    }

   const getUserData= async(accessToken, loggedThrough) =>{
     try {
      setLoading(true)
      const response = await APIFetch({
        url: `${url}auth/signin`,
        method: 'POST', 
        body: {
        accessToken: accessToken,
        loggedThrough: loggedThrough
        }})

        if(!response?.success && response.message){
            return setMessage({message:response.message, loggedThrough:response?.loggedThrough})
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
            localStorage.setItem('LOGGED_THROUGH', response?.data?.loggedThrough)
            console.log(`GETTING USER `)

            setCookie('user',user ,{path: '/', maxAge: 2000})
            if(response?.data.accessToken){
              setCookie('accessToken', response?.data.accessToken,{path: '/', maxAge: 2000})
            }
            // removeCookie('accessToken', {path:'/'})
//             removeCookie('accessToken', {path:'/auth'})
            setIsLogged(true)
            // window.localStorage.clear()
        }

        setLoading(false)
    } catch (error) {
      return setMessage({message:error})

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
    const handleDelete = async({data, user, accessToken}) =>{
      let email = data?.get('email')
      let password = data?.get('password')
      
      try {
        console.log(`handleDelete IS WORKING`)
        if(email && password){
          // let dbDelete = await handleFetchType({updatedParams: {password, email}, email , accessToken, uri:'/delete', method: 'delete'})

          if(!dbDelete?.success) return setMessage({message:dbDelete?.message})
          console.log(dbDelete)
          setMessage({message: dbDelete?.message})
          return {message: dbDelete?.message}
        } else
        if(accessToken !=='undefined' && !password ){
          console.log(`DELETING THROUGH ACCESS-TOKEN`)
          
          let dbDelete = await APIFetch({url: `${url}change/delete`, method:'delete', body: {userEmail: user?.email, accessToken}})

          console.log(dbDelete)
          if(!dbDelete?.success) return setMessage({message:dbDelete?.message})

          setMessage({message: dbDelete?.message})
          return {message:dbDelete?.message}
        }

      } catch (error) {
        return setMessage({message:error})
      }

    }

   const handleChangeFetch = async ({data,user, accessToken}) => {
    // change users information.
    // console.log(user);
    let email = data?.get('email')
    let fullName = data?.get('name')
    let bio = data?.get('bio')
    let phone = data?.get('phone')
    let password = data?.get('password')
    let picture = data?.get('picture')
    let changesArr={}
    console.log(`data: `, data)
    try {
     setLoading(true)

      //add updatedParams if they have been added by user
     if(picture){
      let uri = await convertBase64(picture);
      console.log(`uri: `,uri);
       changesArr.picture = uri
       console.log(`picture is added`);
     }
      if(email) 
      {
        console.log(`email is added`);
        changesArr.email = email
      }
      if(fullName)
      {
        console.log(`fullName is added`);
        changesArr.fullName = fullName
      }
     
      if(bio) 
      {
        console.log(`bio is added`);
        changesArr.bio = bio
      }
      if(phone) 
      {
        console.log(`phone is added`);
        changesArr.phone = phone
      }
      if(password)
      {
        console.log(`password is added`);
        changesArr.password = password
      }
      // send request to change user's information

      console.log(`is going to send response`)
      let response = await APIFetch({url: `${url}change`, method:'post', body: {updatedParams: changesArr, userEmail: user?.email, accessToken}});
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
      setMessage({message: response?.data?.message, changes: response?.data?.changes});
      return  await getUserData(response?.data?.accessToken, user?.loggedThrough || localStorage.getItem('LOGGED_THROUGH'));

    } catch (error) {
      setLoading(true)
      return setMessage({message:error})      
    }
  }
   return { getUserData, fetchSignin,fetchRegister,checkAccessToken,checkQueryString,handleChangeFetch,handleDelete,
    }
}

export default useFetch