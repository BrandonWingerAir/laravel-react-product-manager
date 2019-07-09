import React, { Component } from 'react'

class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: null
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.setState({ product: this.props.product });
  }

  handleInput(key, e) {
    let state = Object.assign({}, this.state.product);
    state[key] = e.target.value;
    this.setState({ product: state });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.update(this.state.product);
    this.editForm.reset();
  }

  render() {
    const product = this.state.product;

    const divStyle = {
      position: 'inline-block',
      marginTop: '30px',
      flexDirection: 'space-between',
      marginLeft: '30px',
      width: '40vw'
    }

    const editPriceStyle = {
      width: '30%'
    }

    return (
      <div style={divStyle}>
        <h2>Edit Product</h2>
        <div>
          <form 
            onSubmit={this.handleSubmit}
            ref={input => (this.editForm = input)}
          >
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                className="form-control"
                type="text" 
                name="title" 
                value={product.title}
                onChange={e => this.handleInput("title", e)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                className="form-control"
                rows="4"
                name="description" 
                value={product.description}
                onChange={e => this.handleInput("description", e)}
              ></textarea>
            </div>

            <div className="form-group" style={editPriceStyle}>
              <label htmlFor="price">Price:</label>
              <input
                className="form-control"
                type="text" 
                name="price" 
                value={product.price}
                onChange={e => this.handleInput("price", e)}
              />
            </div>

            <div className="form-group" style={editPriceStyle}>
              <label>Availability:</label>
              <select className="form-control" value={product.availability} onChange={(e)=>this.handleInput('availability', e)}>
                <option value="1">Available</option>
                <option value="0">Out of stock</option>
              </select>
            </div>

            <input className="btn btn-primary" type="submit" value="Submit"/>
          </form>
        </div>
      </div>
    )
  }
}

export default EditProduct;
