import React from 'react';
import imageSrc from '../assets/house5.jpg';
import logo from '../assets/logo.png'

export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-4xl font-bold mb-5 text-slate-800 font-custom flex items-center mr-0'> {/* Add flex and items-center classes */}
        About Movease
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={imageSrc} alt="About Movease" className="rounded-lg shadow-lg"/>
        </div>
        <div>
          <p className='mb-4 text-lg text-gray-900 font-custom'>
            Movease is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.
          </p>
          <p className='mb-4 text-lg text-gray-900 font-custom'>
            Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.
          </p>
          <p className='mb-4 text-lg text-gray-900 font-custom'>
            Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.
          </p>
        </div>
      </div>
    </div>
  );
}
