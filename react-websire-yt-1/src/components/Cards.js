import React from 'react';
import './Cards.css';
import CardItem from './CardItem.js';

const cardData = [
  {
    src: 'images/OIP.jpg',
    text: 'Our AI technology continues to learn while exceeding your needs.',
    label: 'Adventure',
    path: '/services'
  },
  {
    src: 'images/OIP.jpg',
    text: 'Loads Faster',
    label: '1.5 Model 5x',
    path: '/services'
  },
  {
    src: 'images/OIP.jpg',
    text: 'Responds and provides accurate feedback',
    label: '1.5 Model 5x',
    path: '/services'
  },
  {
    src: 'images/OIP.jpg',
    text: 'Design for E-Commerce',
    label: '1.5 Model 5x',
    path: '/products'
  },
  {
    src: 'images/OIP.jpg',
    text: 'Take your gaming to the next level',
    label: '4.5 Model 10x',
    path: '/sign-up'
  }
];

const Cards = () => {
  return (
    <div className='cards'>
      <h1>Review our latest models that is tailored to your business needs.</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            {cardData.map((card, index) => (
              <CardItem
                key={index}
                src={card.src}
                text={card.text}
                label={card.label}
                path={card.path}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
