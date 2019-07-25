import React, { Component } from 'react';
import Product from './Product';

class AddProduct extends Component {
  constructor(props) {
    super(props);
      this.state = {
        newProduct: {
            id: '',
            title: '',
            description: '',
            notes: '',
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

    return(
      <div> 
        <div style={divStyle}> 
          <h2>New Product</h2>
          <hr/>
          <form className="product-form" onSubmit={this.handleSubmit} encType="multipart/form-data">
            <div className="form-group title-error">
              <label><h4>Title:</h4></label>
              <input className="form-control" type="text" onChange={(e)=>this.handleInput('title', e)}/>
            </div>

            <ul className="text-danger title-error-text" style={{ listStyle: 'none' }}></ul>

            <div className="form-group">
              <label><h4>Image <span style={{ fontWeight: '400' }}>(Optional):</span></h4></label>
              <input type="file" onChange={(e)=>this.handleInput('image', e)}/>
            </div>
            
            <div className="form-group version-error">
              <label><h4>Version:</h4></label>
              <input className="form-control" type="text" onChange={(e)=>this.handleInput('description', e)}/>
            </div>

            <ul className="text-danger version-error-text" style={{ listStyle: 'none' }}></ul>
            
            <div className="form-group">
              <label><h4>Notes <span style={{ fontWeight: '400' }}>(Optional)</span>:</h4></label>
              <textarea className="form-control" rows="3" onChange={(e)=>this.handleInput('notes', e)}></textarea>
            </div>
            
            <h4>Ratings:</h4>
            <hr style={{ width: '40%', marginLeft: '0' }}/>
            <label><h5>User Interface:</h5></label>
            <select className="form-control form-option" defaultValue="3" type="number" onChange={(e)=>this.handleRating('user_interface', e)}>
              <option value="1">1 (Poor)</option>
              <option value="2">2 (Okay)</option>
              <option value="3">3 (Good)</option>
              <option value="4">4 (Great)</option>
              <option value="5">5 (Perfect)</option>
            </select>

            <label><h5>Speed/Size:</h5></label>
            <select className="form-control form-option" defaultValue="3" type="number" onChange={(e)=>this.handleRating('speed_size', e)}>
              <option value="1">1 (Poor)</option>
              <option value="2">2 (Okay)</option>
              <option value="3">3 (Good)</option>
              <option value="4">4 (Great)</option>
              <option value="5">5 (Perfect)</option>
            </select>

            <label><h5>Software:</h5></label>
            <select className="form-control form-option" defaultValue="3" type="number" onChange={(e)=>this.handleRating('software', e)}>
              <option value="1">1 (Poor)</option>
              <option value="2">2 (Okay)</option>
              <option value="3">3 (Good)</option>
              <option value="4">4 (Great)</option>
              <option value="5">5 (Perfect)</option>
            </select>

            <label><h5>Security:</h5></label>
            <select className="form-control form-option" defaultValue="3" type="number" onChange={(e)=>this.handleRating('administration', e)}>
              <option value="1">1 (Poor)</option>
              <option value="2">2 (Okay)</option>
              <option value="3">3 (Good)</option>
              <option value="4">4 (Great)</option>
              <option value="5">5 (Perfect)</option>
            </select>

            <label><h5>Support:</h5></label>
            <select className="form-control form-option" defaultValue="3" type="number" onChange={(e)=>this.handleRating('support', e)}>
              <option value="1">1 (Poor)</option>
              <option value="2">2 (Okay)</option>
              <option value="3">3 (Good)</option>
              <option value="4">4 (Great)</option>
              <option value="5">5 (Perfect)</option>
            </select>

            <hr style={{ width: '40%', margin: '30px 0 10px' }}/>

            <div className="form-group form-option">
              <label><h4>Would you recommend?</h4></label>
              <select className="form-control" type="number" onChange={(e)=>this.handleInput('availability', e)}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <button id="add-new-btn" className="btn btn-primary" type="submit" style={{ marginRight: '20px' }}>
              Submit
            </button>
            <button className="btn btn-default" onClick={this.props.cancelClick}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default AddProduct;
