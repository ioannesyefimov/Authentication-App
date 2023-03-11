import React, { useEffect, useState } from 'react'
import { correctUploadIco } from '../../../Assets'
import { useAuthentication } from '../../Authentication/Authentication'
import { convertBase64 } from '../../utils/utils'
import AlertDiv from '../../AlertDiv/AlertDiv'

const UploadInput = ({children, setSelectedFile},) => {
    const [Response, setResponse] = useState('')
    const {User, setCookie} = useAuthentication()

 
    const handleFileChange = (e) =>{
        if(e.target.files){
            setSelectedFile(e.target.files[0])
        }
        console.log(e.target.files)
    }

   const changePhoto = async (event) => {
   
    // const file = event.target.files[0]
    const base64 = await convertBase64(selectedFile)
    

        // 👇 Uploading the file using the fetch API to the server
     const uplaod = await fetch('http://localhost:5050/api/upload/picture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            image: base64
          }),
        })

      const uploadResponse = await uplaod.json()

      if(uploadResponse.success){
        console.log(uploadResponse.data)
        const changePhoto = await fetch('http://localhost:5050/api/change/picture', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({
            email: User?.email,
            newPicture: uploadResponse?.data?.url
          }),
        })

        const isChanged = await changePhoto.json()
        console.log(isChanged)
        if(isChanged.success){
          setResponse({message: isChanged?.data?.message, success: isChanged?.success})
          const updatedUser = User
          updatedUser.picture = isChanged?.data?.url
          setCookie('user', updatedUser, {path:'/'} )
        }

      }
      else {
        setResponse({message: isChanged?.message, success: isChanged?.success})
        console.log(uploadResponse)
      }
     
      };
      
    

  return (
    <>
    {Response?.message ? (
      <AlertDiv success={Response?.success} message={Response?.message} setMessage={setResponse} />
    ) : null }
    <label className='file-input' htmlFor="file-upload ">

        <input accept='image/*'  type="file" onChange={handleFileChange} name="photo file input" id="file-upload" />
        {children}
    </label>
    </>
    )
}

export default UploadInput