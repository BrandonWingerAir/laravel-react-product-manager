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
      alert(`An Error Occurred! ${error}`);
    });    
  }

  render() {
    return (
      <div style={styles}>
        <h2>Welcome Home {"\u2728"}</h2>
        <p>Dashboard</p>
        <div className="panel panel-default" style={{ width: '80%', margin: '0 auto 15px' }}>
          <div className="panel-body">
            <p>Username: {this.state.user.name}</p>
          </div>
        </div>
        <button
          className="btn btn-info"
          onClick={this.props.logoutUser}
        >
          Logout{" "}
        </button>
      </div>
    );
  }
}

export default Home;