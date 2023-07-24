import React from 'react';
import '../App.css';
import Button from './Button';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className='hero-container'>
      {/* Background Video */}
      <video src={process.env.PUBLIC_URL + '/images/video-2.mp4'} autoPlay loop muted />

      {/* Title and Description */}
      <div className='hero-content'>
        <h1>Unlock your software's true potential</h1>
        <p>What are you waiting for?</p>

        {/* Buttons */}
        <div className='hero-btns'>
          {/* Get Started Button */}
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
          >
            GET STARTED
          </Button>

          {/* Watch Trailer Button */}
          <Button
            className='btns'
            buttonStyle='btn--primary'
            buttonSize='btn--large'
            onClick={() => console.log('Click')}
          >
            WATCH TRAILER <i className='far fa-play-circle' />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
