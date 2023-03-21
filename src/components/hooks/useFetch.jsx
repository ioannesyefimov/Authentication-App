import { useAuthentication } from '../Authentication/Authentication'
import { APIFetch, Errors } from '../utils/utils';
import { convertBase64,validateInput} from '../utils/utils';

const useFetch = () => {

    const {setCookie, setMessage,setLoading,removeCookie,setIsLogged, logout} = useAuthentication()
    const url = `http://localhost:5050/api/`
    let newURL = location.href.split("?")[0];

   
    const fetchRegister = async ({fullNameRef,passwordRef,emailRef}) => {
      // do clean up before 
      try {
        removeCookie('user', {path: '/'})
        removeCookie('accessToken', {path: '/'})
        const isValidInput =await validateInput(
          {firstRef:emailRef , secondRef:fullNameRef , thirdRef:passwordRef}
          );
        console.log(isValidInput)
        console.log(`email: `, emailRef.current.value)
        if(!isValidInput?.success) return setMessage({success:false,message: isValidInput?.message})
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
        logout()
          return setMessage({message:response.message, loggedThrough: response?.loggedThrough})
      } 
        setCookie('accessToken', response.data.accessToken, {path: '/', maxAge: 2000})
        setCookie('refreshToken', response.data.refreshToken, {path: '/', maxAge: 2000})

        localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)

        } catch (error) {
          return setMessage({message:error})

        } finally{
          setLoading(false)
        }

    }

    const fetchSignin = async (emailRef,passwordRef) => {
      const isValidInput = await validateInput({firstRef:emailRef , 
        secondRef:undefined, thirdRef:passwordRef , setMessage});
        
        console.log(isValidInput)
        if(!isValidInput?.success){
          return setMessage({message: isValidInput?.message})
        }
        
        try {
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
              logout()
               return  setMessage({message:response?.message, loggedThrough: response?.loggedThrough})
            } 
              // setCookie('user',response.data.user, {path: '/', maxAge: '2000'})
              setCookie('accessToken', response.data.accessToken, {path: '/', maxAge: 2000})
              localStorage.setItem('LOGGED_THROUGH', response.data.loggedThrough)
  
        } catch (error) {
          return setMessage({message:error})

        } finally {
          setLoading(false)
        }


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

        if(!response?.success ){
          logout()
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
                loggedThrough: response?.data?.loggedThrough
            }

            console.log(response)
            localStorage.setItem('LOGGED_THROUGH', response?.data?.loggedThrough)
            console.log(`GETTING USER `)

            setCookie('user',user ,{path: '/', maxAge: 2000})
            if(response?.data.accessToken){
              setCookie('accessToken', response?.data.accessToken,{path: '/', maxAge: 2000})
            }
            setIsLogged(true)
      return {token: response?.data?.accessToken}

            // window.localStorage.clear()
        }

    } catch (error) {
      return setMessage({message:error})
    } finally {
      setLoading(false)

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
    const handleDelete = async({data, user, accessToken,deletedThrough}) =>{

      let email = data?.get('email')
      let password = data?.get('password')
      console.log(email);
      console.log(password);
      console.log(`token DELETING:`, accessToken)
      try {
        console.log(`handleDelete IS WORKING`)
        if(email && password){
          let dbDelete = await APIFetch({url: `${url}change/delete`, method:'delete', body: {userEmail: user?.email,updatedParams:{password}, accessToken}})

          if(!dbDelete?.success) return {success:false, message:dbDelete?.message}
        } else
        if(accessToken !=='undefined' || accessToken !== undefined && !password ){
          console.log(`DELETING THROUGH ACCESS-TOKEN`)
          
          let dbDelete = await APIFetch({url: `${url}change/delete`, method:'delete', body: {userEmail: user?.email, accessToken, deletedThrough}})

          console.log(dbDelete)
          if(!dbDelete?.success) 
          {
            return {success:false, message:dbDelete?.message}
          }
          return {success:true, message:dbDelete?.message}
        }

      } catch (error) {
        return {success:true, message:error}

      } finally{
        setLoading(false)
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

        return setMessage({message: response?.message})
      };
      if(!response?.data?.accessToken){

        return setMessage({message:response?.message})  
      }
      setCookie('accessToken', response?.data?.accessToken, {path:'/', maxAge: 2000})

      setMessage({message: response?.data?.message, changes: response?.data?.changes});
      
      return  await getUserData(response?.data?.accessToken, user?.loggedThrough || localStorage.getItem('LOGGED_THROUGH'));

    } catch (error) {
      return setMessage({message:error})      
    } finally{
      setLoading(false)
    }
  }
   return { getUserData, fetchSignin,fetchRegister,handleChangeFetch,handleDelete,
    }
}

export default useFetch