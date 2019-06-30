import React, { Component } from 'react';

class AddProduct extends Component {
  constructor(props) {
    super(props);
      this.state = {
        newProduct: {
            title: '',
            description: '',
            price: 0,
            availability: 0
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
    const divStyle = {
      position: 'absolute',
      left: '35%',
      top: '60%',
      flexDirection: 'space-between',
      marginLeft: '30px'
    }
    
    const inputStyle = {
      margin: '0px 10px'
    }
    return(
      <div> 
        <div style={divStyle}> 
          <h2> Add new product </h2>
          <form onSubmit={this.handleSubmit}>
            <label> 
              Title: 
              <input style={inputStyle} type="text" onChange={(e)=>this.handleInput('title',e)} />
            </label>
            
            <label> 
              Description: 
              <input style={inputStyle}  type="text" onChange={(e)=>this.handleInput('description',e)} />
            </label>
            
            <label>
              Price:
              <input style={inputStyle}  type="number" onChange={(e)=>this.handleInput('price', e)}/>
            </label>

            <input style={inputStyle}  type="submit" value="Submit" />
          </form>
        </div>
      </div>
    )
  }
}

export default AddProduct;
