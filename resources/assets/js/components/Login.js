import React from "react";
import { Link } from "react-router-dom";

const Login = ({ history, loginUser = f => f }) => {
  let _email, _password;

  const handleLogin = e => {
    e.preventDefault();
    loginUser(_email.value, _password.value);
  };

  const inputStyle = { width: '70%', marginBottom: '20px' }

  return (
    <div id="main">
      <div className="col-xs-12 col-md-4 padding-0">
        <form action="" id="login-form" onSubmit={handleLogin} method="post" className="text-center" style={{ border: '1px solid #e0e0e0', width: '80%', margin: '30px auto', paddingBottom: '20px', background: '#fafafa' }}>
          <h3 style={{ boxSizing: 'border-box', margin: 0, padding: '25px', background: '#f5f5f5 ' }}>
            Login
          </h3>

          <hr style={{ marginTop: 0, borderColor: '#e0e0e0' }}/>

          <div className="form-group">
            <input ref={input => (_email = input)} autoComplete="off" id="email-input" name="email" type="email"  className="form-control center-block" placeholder="Email" style={inputStyle}/>
          </div>
          
          <div className="form-group">
            <input ref={input => (_password = input)} autoComplete="off" id="password-input" name="password" type="password" className="form-control center-block" placeholder="Password" style={inputStyle}/>
          </div>

          <button type="submit" className="btn btn-primary center-block email-login-btn" style={{ margin: '20px auto 10px' }} href="#!">
            Login
          </button>

          <Link to="/register">
            Register
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;