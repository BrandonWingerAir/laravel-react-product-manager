import React, { Component } from 'react';

class AddProduct extends Component {
  constructor(props) {
    super(props);
      this.state = {
        newProduct: {
            id: '',
            title: '',
            description: '',
            user_interface: 5,
            speed_size: 5,
            software: 5,
            support: 5,
            administration: 5,
            rating: 5,
            availability: 1
        }
      }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleRating = this.handleRating.bind(this);
  }
  
  handleInput(key, e) {
    var state = Object.assign({}, this.state.newProduct); 
    
    if (e.target.type === "select-one") {
      state[key] = parseInt(e.target.value)
    } else if (e.target.type === "file") {
      state[key] = e.target.files[0];
    } else {
      state[key] = e.target.value
    }

    this.setState({ newProduct: state });
  }

  handleRating(key, e) {
    var state = Object.assign({}, this.state.newProduct); 
    state[key] = parseFloat(e.target.value);

    state.rating = (
      state.user_interface
      + state.speed_size
      + state.software
      + state.support
      + state.administration
    ) / 5;

    this.setState({newProduct: state });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onAdd(this.state.newProduct);
  }

  render() {
    const divStyle = {
      marginLeft: '30px',
      marginRight: '30px'
    }
    
    const createPriceStyle = {
      width: '30%'
    }

    return(
      <div> 
        <div style={divStyle}> 
          <h2>New Product</h2>
          <form onSubmit={this.handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label>Title:</label>
              <input className="form-control" type="text" onChange={(e)=>this.handleInput('title', e)} required/>
            </div>

            <div className="form-group">
              <label>Image:</label>
              <input type="file" onChange={(e)=>this.handleInput('image', e)}/>
            </div>
            
            <div className="form-group">
              <label>Version:</label>
              <input className="form-control" type="text" onChange={(e)=>this.handleInput('description', e)}></input>
            </div>
            
            <label>User Interface</label>
            <select className="form-control" style={createPriceStyle} type="number" onChange={(e)=>this.handleRating('user_interface', e)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            <label>Speed/Size</label>
            <select className="form-control" style={createPriceStyle} type="number" onChange={(e)=>this.handleRating('speed_size', e)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            <label>Software</label>
            <select className="form-control" style={createPriceStyle} type="number" onChange={(e)=>this.handleRating('software', e)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            <label>Administration</label>
            <select className="form-control" style={createPriceStyle} type="number" onChange={(e)=>this.handleRating('administration', e)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            <label>Support</label>
            <select className="form-control" style={createPriceStyle} type="number" onChange={(e)=>this.handleRating('support', e)}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>

            <div className="form-group" style={createPriceStyle}>
              <label>Would you recommend?</label>
              <select className="form-control" type="number" onChange={(e)=>this.handleInput('availability', e)}>
                <option value="1">Yes</option>
                <option value="0">No</option>
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
