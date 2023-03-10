import React, { useEffect, useState } from 'react'
import { correctUploadIco } from '../../../Assets'

const UploadInput = ({children}) => {
    const [selectedFile, setSelectedFile] = useState(1)

    useEffect(()=>{
      console.log(selectedFile)
    },[selectedFile])

    const handleFileChange = (e) =>{
        if(e.target.files){
            setSelectedFile(e.target.files[0])
        }
        console.log(e.target.files)
    }

    const handlePhotoSubmit = () =>{
        if (!selectedFile) {
            return;
          }
      
          // 👇 Uploading the file using the fetch API to the server
          fetch('https://httpbin.org/post', {
            method: 'POST',
            body: file,
            // 👇 Set headers manually for single file upload
            headers: {
              'content-type': selectedFile.type,
              'content-length': `${selectedFile.size}`, // 👈 Headers need to be a string
            },
          })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
        };
    
    

  return (
    <label className='file-input' htmlFor="file-upload ">
        <input accept='image/*'  type="file" onChange={handleFileChange} name="photo file input" id="file-upload" />
        {children}
    </label>
    )
}

export default UploadInput