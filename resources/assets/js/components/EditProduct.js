import React, { Component } from 'react'

class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: {}
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({ product: this.props.product });
  }

  handleInput(key, e) {
    let state = Object.assign({}, this.state.product);
    
    if (e.target.type === "select-one") {
      state[key] = parseInt(e.target.value)
    } else if (e.target.type === "file") {
      state[key] = e.target.files[0];
    } else {
      state[key] = e.target.value
    }

    this.setState({ product: state });
  }

  handleRating(key, e) {
    var state = Object.assign({}, this.state.product); 
    state[key] = parseFloat(e.target.value);

    state.rating = (
      state.user_interface
      + state.speed_size
      + state.software
      + state.support
      + state.administration
    ) / 5;

    this.setState({product: state });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.product.image) {
      this.state.product.image = null;
    }    

    this.props.update(this.state.product);
  }

  render() {
    const product = this.state.product;

    const divStyle = {
      position: 'inline-block',
      margin: '30px',
      flexDirection: 'space-between',
      marginLeft: '30px',
      marginBottom: '40px'
    }

    return (
      <div style={divStyle}>
        <h2>Edit Product</h2>
        <hr/>
        <div>
          <form 
            onSubmit={this.handleSubmit}
            ref={input => (this.editForm = input)}
            encType="multipart/form-data"
            className="product-form"
          >
            <div className="form-group">
              <label htmlFor="title"><h4>Title:</h4></label>
              <input
                className="form-control"
                type="text" 
                name="title" 
                value={product.title}
                onChange={e => this.handleInput("title", e)}
              />
            </div>

            { !this.state.product.title ? (
              <p className="text-danger">Title is required.</p>
            ) : (
              <div/>
            )}

            <ul className="title-error-text text-danger" style={{ listStyle: 'none' }}></ul>

            <div className="form-group">
              <label><h4>Image (Optional):</h4></label>
              <input type="file" name="image" onChange={(e)=>this.handleInput('image', e)}/>
            </div>

            <div className="form-group">
              <label htmlFor="description"><h4>Version:</h4></label>
              <input
                className="form-control"
                type="text"
                name="description" 
                value={product.description}
                onChange={e => this.handleInput("description", e)}
            />
            </div>

            { !this.state.product.description ? (
              <p className="text-danger">Version is required.</p>
            ) : (
              <div/>
            )}

            <ul className="version-error-text text-danger" style={{ listStyle: 'none' }}></ul>

            <div className="form-group">
              <label><h4>Notes (Optional):</h4></label>
              <textarea 
                className="form-control" 
                rows="3" 
                name="notes"
                value={product.notes}
                onChange={(e)=>this.handleInput('notes', e)}>
              </textarea>
            </div>

            <h4>Ratings:</h4>
            <hr style={{ width: '40%', marginLeft: '0' }}/>

            <label><h5>User Interface</h5></label>
            <select className="form-control form-option" style={editPriceStyle} defaultValue={product.user_interface} type="number" name="user_interface" onChange={(e)=>this.handleRating('user_interface', e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label><h5>Speed/Size</h5></label>
            <select className="form-control form-option" style={editPriceStyle} defaultValue={product.speed_size} type="number" name="speed_size" onChange={(e)=>this.handleRating('speed_size', e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label><h5>Software</h5></label>
            <select className="form-control form-option" style={editPriceStyle} defaultValue={product.software} type="number" name="software" onChange={(e)=>this.handleRating('software', e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label><h5>Administration</h5></label>
            <select className="form-control form-option" style={editPriceStyle} defaultValue={product.administration} type="number" name="administration" onChange={(e)=>this.handleRating('administration', e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <label><h5>Support</h5></label>
            <select className="form-control form-option" style={editPriceStyle} defaultValue={product.support} type="number" name="support" onChange={(e)=>this.handleRating('support', e)}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

            <hr style={{ width: '40%', margin: '30px 0 10px' }}/>

            <div className="form-group" style={editPriceStyle}>
              <label><h5>Would you recommend?</h5></label>
              <select className="form-control" value={product.availability} name="availability" onChange={(e)=>this.handleInput('availability', e)}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            { !this.state.product.title || !this.state.product.description ? (
              <div>
                <button className="btn btn-primary mobile-btn disabled" style={{ marginRight: '20px', marginTop: '15px' }}>
                  Submit
                </button>
                <button className="btn btn-default mobile-btn" style={{ marginTop: '15px' }} onClick={this.props.cancelClick}>
                  Cancel
                </button>
                <p className="text-danger">A required field is empty.</p>
              </div>
              ) : (
                <div>
                  <button className="btn btn-primary mobile-btn" type="submit" style={{ marginRight: '20px', marginTop: '15px' }}>
                    Submit
                  </button>
                  <button className="btn btn-default mobile-btn" style={{ marginTop: '15px' }} onClick={this.props.cancelClick}>
                    Cancel
                  </button>
                </div>
            ) }
          </form>
        </div>
      </div>
    )
  }
}

export default EditProduct;
