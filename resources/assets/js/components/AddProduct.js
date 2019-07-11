import React, { Component } from 'react';

class AddProduct extends Component {
  constructor(props) {
    super(props);
      this.state = {
        newProduct: {
            title: '',
            description: '',
            price: 0,
            availability: 1
        }
      }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }
  
  handleInput(key, e) {
    var state = Object.assign({}, this.state.newProduct); 
    state[key] = e.target.value;
    this.setState({newProduct: state });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.newProduct);
  }

  render() {
    const mainDivStyle = {
      display: 'inline-block',
      width: '40vw'
    }

    const divStyle = {
      position: 'inline-block',
      marginTop: '30px',
      flexDirection: 'space-between',
      marginLeft: '30px',
      width: '40vw'
    }
    
    const createPriceStyle = {
      width: '30%'
    }

    return(
      <div style={mainDivStyle}> 
        <hr/>
        <div style={divStyle}> 
          <h2>New Product</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input className="form-control" type="text" onChange={(e)=>this.handleInput('title', e)} required/>
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea className="form-control" type="text" onChange={(e)=>this.handleInput('description', e)}></textarea>
            </div>
            
            <div className="form-group" style={createPriceStyle}>
              <label>Price:</label>
              <input className="form-control" type="number" onChange={(e)=>this.handleInput('price', e)}/>
            </div>

            <div className="form-group" style={createPriceStyle}>
              <label>Availability:</label>
              <select className="form-control" type="number" onChange={(e)=>this.handleInput('availability', e)}>
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

export default AddProduct;
