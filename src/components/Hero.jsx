import React from 'react';
// Import the image from the assets folder
import HeroImage from '../assets/image 2.png'; // Update the path as per your folder structure
import Navbar from './Navbar';

const Hero = () => {
  return (
  
    <section className="relative flex items-center justify-between h-screen  max-w-7xl z-20 mx-auto  px-6 md:px-12">
    <div className="absolute top-80 left-10 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue rounded-full opacity-50 z-0 blur-[90px]"></div>
    <div className="absolute top-3/4 right-1 transform -translate-x-1/ -translate-y-1/3 w-[250px] h-[250px] bg-blue rounded-full opacity-70 z-0 blur-[100px]"></div>
    {/* <Navbar/> */}
      {/* Left Side (Text) */}
      <div className="text-left max-w-lg z-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-tight mb-4">
          The World’s <br /> Best Creators <br /> Are On <span className="text-primary">SkillVerse</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-700 mb-8">
          A comprehensive platform to help hirers and creators navigate the creative world, from discovering inspiration to connecting with one another.
        </p>
      </div>

      {/* Right Side (Image) */}
      <div className="hidden lg:block max-w-md z-20">
        {/* Use the imported image */}
        <img
          src={HeroImage}
          alt="Hero"
          className="w-[500px] h-[500px] object-cover rounded-lg "
        />
      </div>
    </section>

  );
};

export default Hero;
