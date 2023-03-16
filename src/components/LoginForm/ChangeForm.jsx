import React from 'react'
import './ChangeForm.scss'
const ChangeForm =  React.forwardRef((props,ref) => (
  // const {name,placeholder, type} = props

    <div className="inner-wrapper">
    <label className='label-color' htmlFor={props.name}>
      {props.name}
    </label>
    <input placeholder={props.placeholder} type={props.type}  ref={ref ? ref : null} name={props.name} id={props.name} aria-label={`${props.name} `} />

  </div>
  
))  
  
  

export default ChangeForm