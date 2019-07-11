import React from "react";
import { Link } from "react-router-dom";

const Login = ({ history, loginUser = f => f }) => {
  let _email, _password;

  const handleLogin = e => {
    e.preventDefault();
    loginUser(_email.value, _password.value);
  };

  return (
    <div id="main">
      <form action="" id="login-form" onSubmit={handleLogin} method="post">
        <h3 style={{ padding: 15 }}>Login Form</h3>

        <input ref={input => (_email = input)} style={styles.input} autoComplete="off" id="email-input" name="email" type="email" className="center-block" placeholder="Email"/>
        <input ref={input => (_password = input)} style={styles.input} autoComplete="off" id="password-input" name="password" type="password" className="center-block" placeholder="Password"/>

        <button type="submit" style={styles.button} className="landing-page-btn center-block text-center" id="email-login-btn" href="#facebook">
          Login
        </button>

        <Link style={styles.link} to="/register">
          Register
        </Link>
      </form>
    </div>
  );
};

const styles = {
  input: {
    backgroundColor: "white",
    border: "1px solid #ccc",
    padding: 15,
    float: "left",
    clear: "right",
    width: "80%",
    margin: 15
  },
  button: {
    height: 44,
    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
    border: "none",
    backgroundColor: "red",
    margin: 15,
    float: "left",
    clear: "both",
    width: "85%",
    color: "white",
    padding: 15
  },
  link: {
    width: "100%",
    float: "left",
    clear: "both",
    textAlign: "center"
  }
};

export default Login;