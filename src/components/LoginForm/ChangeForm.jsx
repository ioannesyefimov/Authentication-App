import React from 'react'

const ChangeForm =  React.forwardRef((props,ref) => (
  // const {name,placeholder, type} = props

    <div className="inner-wrapper">
    <label className='label-color' htmlFor={props.name}>
      {props.name}
    </label>
    <input placeholder={props.placeholder} type={props.type} ref={ref} name={props.name} id={props.name} aria-label={`${props.name} `} />

  </div>
  
))  
  
  

export default ChangeForm