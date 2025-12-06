import React from 'react'
import photo from './home.png'

const HomePage = () => {
  return (
    <div className='w-full relative'>
      <div className='relative w-full'>
        <img src={photo} alt="Home Page Photo" className='w-full'/>
        
        {/* Overlay content */}
        <div className='absolute inset-0 flex flex-col justify-between items-center w-full h-full'>
          {/* Top Section - FITNESS FLOW */}
          <div className='w-full flex justify-center pt-16'>
            <div className='text-3xl md:text-4xl font-extrabold text-center italic shadow-md shadow-blue-600  text-blue-600'>
              UNLEASH YOUR POWER
            </div>
          </div>

          {/* Bottom Section - Other text */}
          <div className='w-full flex flex-col items-center pb-32 space-y-4'>
            
            
            <div className='text-xl md:text-2xl font-bold text-center italic text-black'>
              Transform Your Body, Mind & Energy
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage