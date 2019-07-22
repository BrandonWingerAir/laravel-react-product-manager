import React from "react";
import { Link } from "react-router-dom";

const Login = ({ history, loginUser = f => f }) => {
  let _email, _password;

  const handleLogin = e => {
    e.preventDefault();
    loginUser(_email.value, _password.value);
  };

  const inputStyle = { width: '75%', marginBottom: '20px' }

  return (
    <div id="main">
      <div className="col-xs-12 col-md-4 col-md-push-3">
        <form action="" id="login-form" onSubmit={handleLogin} method="post" className="panel panel-default text-center" style={{ boxShadow: 'none', width: '85%', margin: '15px auto' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f5f5f5' }}>
            <h3 style={{ marginTop: '10px' }}>
              User Login
            </h3>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <input ref={input => (_email = input)} autoComplete="off" id="email-input" name="email" type="email"  className="form-control center-block" placeholder="Email" style={inputStyle}/>
            </div>
            
            <div className="form-group">
              <input ref={input => (_password = input)} autoComplete="off" id="password-input" name="password" type="password" className="form-control center-block" placeholder="Password" style={inputStyle}/>
            </div>

            <button type="submit" className="btn btn-primary center-block email-login-btn" style={{ margin: '20px auto 10px' }} href="#!">
              Login
            </button>

            <Link to="/register" style={{ color: '#636b6f' }}>
              Register
            </Link>

            <Link to="/forgot-password" className="center-block" style={{ color: '#636b6f' }}>
              Forgot your password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;