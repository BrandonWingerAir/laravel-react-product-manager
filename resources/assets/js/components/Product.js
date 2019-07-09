import React from 'react';

const Product = props => {
  const {
    product,
    handleEdit,
    update,
    deleteProduct,
    handleDeleteConfirm
  } = props;

  const divStyle = {
    width: '60vw',
    margin: '30px 10px 15px 30px',
  }

  if(!product) {
    return(
      <div style={divStyle}>
        <h2>No product selected.</h2>
      </div>
    );
  }
    
  return(  
    <div style={divStyle}> 
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>Status: {product.availability ? 'Available' : 'Out of stock'}</h3>
      <h3>Price: ${product.price}</h3>
      <input className="btn btn-info" type="button" value="Edit" onClick={e => handleEdit()}/>
      <input className="btn btn-danger" type="button" value="Delete" onClick={e => handleDeleteConfirm()}/>
    </div>
  )
}

export default Product ;