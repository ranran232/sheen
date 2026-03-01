import React from 'react'
import FloatingProductCard from './Featured'

const Hero = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/sheen_hero_bg.webp')" }}
    >
        <FloatingProductCard/>
    </div>
  )
}

export default Hero