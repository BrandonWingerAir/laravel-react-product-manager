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
      <form action="" id="login-form" onSubmit={handleLogin} method="post" className="text-center">
        <h3 style={{ padding: 15 }}>User Login</h3>

        <div className="form-group">
          <input ref={input => (_email = input)} autoComplete="off" id="email-input" name="email" type="email"  className="form-control center-block" placeholder="Email"/>
        </div>
        
        <div className="form-group">
          <input ref={input => (_password = input)} autoComplete="off" id="password-input" name="password" type="password" className="form-control center-block" placeholder="Password"/>
        </div>

        <button type="submit" className="btn btn-primary center-block" id="email-login-btn" href="#facebook">
          Login
        </button>

        <Link to="/register">
          Register
        </Link>
      </form>
    </div>
  );
};

export default Login;