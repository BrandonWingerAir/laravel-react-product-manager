import React from "react";
import axios from "axios";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage["appState"]
      ? JSON.parse(localStorage["appState"]).user.auth_token
      : "",
      user: {}
    };
  }

  renderUserReviews() {
    const listStyle = {
      listStyle: 'none',
      fontSize: '18px',
      lineHeight: '1.8em',
      borderRadius: '0'
    }
    
    return this.props.products.filter((product) => {
      if (product.posted_by === this.state.user.name) {
        return product;
      }
    }).map((product) => {
      const listStyle = {
        listStyle: 'none',
        fontSize: '18px',
        lineHeight: '1.8em',
        paddingLeft: '1em',
      }

      var newKey = `${product.title} (User)`;

      return (
        <li 
          className="list-group-item"
          style={listStyle}
          onClick={() =>this.handleClick(product)} 
          key={newKey}
        >
          <h4 style={{ display: 'inline-block', marginRight: '5px' }}>{product.title}</h4> 
        </li>
      );
    });
  }

  componentDidMount() {
    axios.get(`api/user/home?token=${this.state.token}`)
    .then(response => {
      return response;
    })
    .then(json => {
      if (json.data.success) {
        this.setState({ user: json.data.data });
      } else alert("Login Failed!");
    })
    .catch(error => {
      alert(`Session has expired, please log in.`);
    });
  }

  render() {
    return (
      <div style={styles}>
        <h2>Dashboard &#127968;</h2>
        <div className="panel panel-default" style={{ width: '80%', margin: '0 auto 15px' }}>
          <div className="panel-body">
            <h4>Username: {this.state.user.name}</h4>
            <button
                className="btn btn-success"
                onClick={this.props.renderReviewForm}
                style={{ margin: '0 auto' }}
            >
              New Review
            </button>
            <h4>My Reviews:</h4>
            <ul>
              {this.renderUserReviews()}
            </ul>
          </div>
        </div>
        <button
          className="btn btn-info"
          onClick={this.props.logoutUser}
          style={{ marginBottom: '20px' }}
        >
          Logout{" "}
        </button>
      </div>
    );
  }
}

export default Home;