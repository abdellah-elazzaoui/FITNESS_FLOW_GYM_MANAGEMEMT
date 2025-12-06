import React from 'react'

const Modal = ({children}) => {
  return (
    <div className='absolute backdrop-blur-sm inset-0'>
      {children}
    </div>
  )
}

export default Modal
