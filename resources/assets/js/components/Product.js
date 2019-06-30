import React from 'react';

const Product = ({product}) => {
  const divStyle = {
      display: 'flex',
      flexDirection: 'column',
      width: '65%',
      margin: '30px 10px 10px 30px'
  }

  if(!product) {
    return(
      <div style={divStyle}>
        <h2>No product selected</h2>
      </div>
    );
  }
    
  return(  
    <div style={divStyle}> 
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>Status {product.availability ? 'Available' : 'Out of stock'}</h3>
      <h3>Price : {product.price}</h3>
    </div>
  )
}

export default Product ;