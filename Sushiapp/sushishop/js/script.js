// Importing SVG and PNG assets
// Note: Relative image paths are used because absolute paths won't work with Vite/Vercel
import check from '../assets/check.svg';
import star from '../assets/star.svg';
import sushi12 from '../assets/sushi-12.png';
import sushi11 from '../assets/sushi-11.png';
import sushi10 from '../assets/sushi-10.png';

// Importing AOS (Animate On Scroll) library and its styles
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS with specific settings
// duration: Animation duration in milliseconds
// offset: Offset to trigger animations
AOS.init({
  duration: 1000,
  offset: 100,
});

// Array containing names of trending sushis
const trendingSushis = [
  'Make Sushi',
  'Nigiri Sushi',
  'Oshizushi',
  'Temaki Sushi',
  'Uramaki Sushi',
  'Inari Sushi',
];

// Array containing names of trending drinks
const trendingDrinks = [
  'Oruncha',
  'Ofukucha',
  'Sakura Tea',
  'Kombu-cha',
  'Aojiru',
  'Mugicha',
];

// Array of card objects, each representing a sushi dish
// imgSrc: Image source
// alt: Alternative text for image
// title: Sushi name
// rating: Sushi rating
// price: Sushi price
// active: Optional flag to indicate if the card is active (default is false)
const cards = [
  {
    imgSrc: sushi12,
    alt: 'sushi-12',
    title: 'Chezu Sushi',
    rating: '4.8',
    price: '$21.00',
  },
  {
    imgSrc: sushi11,
    alt: 'sushi-11',
    title: 'Originale Sushi',
    rating: '4.8',
    price: '$21.00',
    active: true,
  },
  {
    imgSrc: sushi10,
    alt: 'sushi-10',
    title: 'Ramen Legendo',
    rating: '4.8',
    price: '$21.00',
  },
];
