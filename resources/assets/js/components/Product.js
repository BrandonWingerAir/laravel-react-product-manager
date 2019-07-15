import React from 'react';

const Product = props => {
  const {
    product,
    handleEdit,
    update,
    deleteProduct,
    handleDeleteConfirm,
    token,
    user
  } = props;

  const divStyle = {
    height: '100%',
    marginLeft: '20px',
    marginTop: '30px'
  }

  if(!product) {
    return(
      <div style={divStyle}>
            <h2>No review selected.</h2>
      </div>
    );
  }
    
  return(
    <div style={divStyle} className="list-group">
      <div className="panel panel-primary">
        <h2 className="list-group-item-heading text-center">
          {product.title}
        </h2>
      </div>
        
      <h4 className="text-center">Reviewed by: {product.posted_by}</h4>

      <hr style={{ width: '50%' }}/>
      
      <div className="list-group-item" style={{ paddingLeft: '30px' }}>
        <h3>
          Status: {product.availability ? 'Available' : 'Out of stock'}
        </h3>

        <h3>
          Price: ${product.price}
        </h3>
        
        { user && product.posted_by === user.name ? (
          <div>
            <input className="btn btn-info" type="button" value="Edit" onClick={e => handleEdit()}/>
            <input className="btn btn-danger" type="button" value="Delete" onClick={e => handleDeleteConfirm()}/>
          </div>
        ) : (
          <div/>
        )}
      </div>
    </div>
  )
}

export default Product ;