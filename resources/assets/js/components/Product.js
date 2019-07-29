import React from 'react';

const Product = props => {
  const {
    renderNewProducts,
    product,
    newReviewForm,
    editBtnClicked,
    handleEdit,
    update,
    deleteProduct,
    handleDeleteConfirm,
    deleteConfirmModal,
    token,
    user
  } = props;

  const divStyle = {
    height: '100%',
    marginTop: '30px',
    minHeight: '100vh'
  }

  const reviewStars = (star) => {    
    var stars = [];

    if (star < Math.round(star)) {
      for (var i = 1; i < star; i++) {
          let starsKey = i + ' (item stars)';

          stars.push(
              <li key={starsKey}>
                  <span className="fa fa-star" aria-hidden="true" style={{ color: '#3097D1' }}></span>
              </li>
          );
      }

      stars.push(
        <li key='item half star'>
            <span className="fa fa-star-half" aria-hidden="true" style={{ color: '#3097D1' }}></span>
        </li>
      );
    } else {
      for (var i = 0; i < Math.round(star); i++) {
        let starsKey = i + ' (item stars)';

        stars.push(
            <li key={starsKey}>
                <span className="fa fa-star" aria-hidden="true" style={{ color: '#3097D1' }}></span>
            </li>
        );
      }
    }

    return stars;
  }

  const renderThumbs = true;

  if (!product && !newReviewForm && !editBtnClicked) {
    return(
      <div style={divStyle}>
        <h2 className="mobile-center">No review selected.</h2>
        
        { token ? (
          <div/>
        ) : (
          <p className="mobile-center">Log in to post a review</p>
        )}

        <hr style={{ borderColor: '#e0e0e0', margin: '20px 0 40px' }}/>

        <div className="panel panel-default text-center" style={{ margin: '15px', borderBottom: '0' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f5f5f5', borderBottom: '0' }}>
            <h3>Latest Reviews</h3>
          </div>
          <div>
            <ul className="list-group">
              { renderNewProducts(5, renderThumbs) }
            </ul>
          </div>
        </div>
      </div>
    );
  } else if (newReviewForm || editBtnClicked) {
    return(
      <div/>
    )
  }
    
  return(
    <div style={divStyle}>
      <div className="panel panel-primary text-center" style={{ background: '#616161', color: '#fff' }}>
        <h2 className="list-group-item-heading">
          {product.title}
        </h2>
      </div>

      { product.image ? (
        <img src={"/" + product.image} alt="" className="img-responsive img-thumbnail center-block" style={{ width: '80%', height: '370px', marginTop: '30px' }}/>
      ) : (
        <div/>
      )}
        
      <h4 className="text-center">Posted by: {product.posted_by}</h4>

      <hr className="text-center" style={{ width: '50%' }}/>
      
      <div className="list-group-item text-center" style={{ paddingBottom: '25px' }}>
        <h4><b>Version:</b> {product.description}</h4>

        <h3>
          <b style={{ marginRight: '10px' }}>Recommended:</b> 
          {
            product.availability 
            ? <i className="fa fa-thumbs-up text-success" aria-hidden="true"></i>
            : <i className="fa fa-thumbs-down text-danger" aria-hidden="true"></i>
          }
        </h3>

        <hr style={{ width: '60%' }}/>

        { product.notes ? (
          <div>
              <div className="well text-left" style={{ width: '88%', margin: '0 auto' }}>
              <p>
                {product.notes}
              </p>
            </div>

            <hr style={{ width: '60%' }}/>
          </div>
        ) : (
          <div/>
        )}

        <ul className="list-unstyled list-inline" style={{ display: 'inline-block', fontSize: '20px', marginTop: '0' }}>
          {(reviewStars(product.rating))}
        </ul>

        <h3 style={{ marginTop: '5px' }}>Rating: {parseFloat(product.rating)}/5</h3>

        <hr style={{ width: '40%' }}/>

        <h4><b>Software:</b> {product.software}/5</h4>
        <h4><b>User Interface:</b> {product.user_interface}/5</h4>
        <h4><b>Speed/Size:</b> {product.speed_size}/5</h4>
        <h4><b>Security:</b> {product.administration}/5</h4>
        <h4><b>Support:</b> {product.support}/5</h4>
        
        { product.posted_by === user.name ? (
          <div>
            <hr style={{ width: '45%' }}/>
            <button className="btn btn-info" style={{ margin: '0 10px' }} type="button" onClick={e => handleEdit()}>
              Edit <i className="fa fa-pencil-square-o" style={{ marginLeft: '2px' }} aria-hidden="true"></i>
            </button>
            <input className="btn btn-danger" style={{ margin: '0 10px' }} type="button" value="Delete" onClick={e => handleDeleteConfirm()}/>
          </div>
        ) : (
          <div/>
        )}
      </div>

      { product.image ? (
        <div/>
      ) : (
        <div>
          <hr/>
          <div className="panel panel-default text-center" style={{ margin: '15px' }}>
            <div className="panel-heading" style={{ backgroundColor: '#f5f5f5', borderBottom: '0' }}>
              <h3>Latest Reviews</h3>
            </div>
            <div>
              <ul id="new-products" className="list-group" style={{ marginBottom: '0' }}>
                { renderNewProducts(3) }
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Product;