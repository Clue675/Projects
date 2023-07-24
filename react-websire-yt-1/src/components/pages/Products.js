import React from 'react';
import '../../App.css';

export default function Products() {
  const products = [
    {
      id: 1,
      name: 'Product 1',
      price: 10,
      image: '/images/product1.jpg',
      description: 'Product 1 description',
    },
    {
      id: 2,
      name: 'Product 2',
      price: 20,
      image: '/images/product2.jpg',
      description: 'Product 2 description',
    },
    {
      id: 3,
      name: 'Product 3',
      price: 30,
      image: '/images/product3.jpg',
      description: 'Product 3 description',
    },
  ];

  const addToCart = (product) => {
    // Add product to cart logic
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className='products-container'>
      <h1 className='products-heading'>AI PRODUCTS</h1>
      <div className='products-list'>
        {products.map((product) => (
          <div key={product.id} className='card'>
            <div className='product-card'>
              <img
                src={process.env.PUBLIC_URL + product.image}
                alt={product.name}
                className='product-image'
              />
              <div className='product-details'>
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
