import React from "react";
import axios from "axios";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
  display: "inline-block",
  float: "right",
  marginRight: "3vw"
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage["appState"]
      ? JSON.parse(localStorage["appState"]).user.auth_token
      : "",
      users: []
    };
  }

  componentDidMount() {
    axios.get(`api/users/list?token=${this.state.token}`)
    .then(response => {
      console.log(response);
      return response;
    })
    .then(json => {
      if (json.data.success) {
        this.setState({ users: json.data.data });
      } else alert("Login Failed!");
    })
    .catch(error => {
      // alert(`An Error Occurred! ${error}`);
    });
  }

  render() {
    return (
      <div style={styles}>
        <h2>Welcome Home {"\u2728"}</h2>
        <p>Member List</p>
        <ul>
          { this.state.users.map(
            user => <ol style={{ 
              padding: 15, 
              border: "1px solid #ccc",
              width: 250,
              textAlign: "left",
              marginBottom: 15,
              marginLeft: "auto",
              marginRight: "auto"
            }} key={user.id}>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
            </ol>
          ) }
        </ul>
        <button
          style={{ padding: 10, backgroundColor: "red", color: "white" }}
          onClick={this.props.logoutUser}
        >
          Logout{" "}
        </button>
      </div>
    );
  }
}

export default Home;