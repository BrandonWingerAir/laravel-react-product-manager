import React from "react";
import { Link } from "react-router-dom";

const Register = ({ history, registerUser = f => f }) => {
  let _email, _password, _name;

  const handleLogin = e => {
    e.preventDefault();
    registerUser(_name.value, _email.value, _password.value);
  };

  const inputStyle = { width: '75%', marginBottom: '20px' }

  return (
    <div id="main">
      <div className="col-xs-12 col-md-4 col-md-push-3">
        <form action="" id="login-form" onSubmit={handleLogin} method="post" className="panel panel-default text-center" style={{ boxShadow: 'none', width: '85%', margin: '15px auto' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f5f5f5' }}>
            <h3 style={{ marginTop: '10px' }}>
              Register
            </h3>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <input ref={input => (_name = input)} autoComplete="off" id="name-input" name="name" type="text" className="form-control center-block" style={inputStyle} placeholder="Name"/>
            </div>

            <div className="form-group">
              <input ref={input => (_email = input)} autoComplete="off" id="email-input" name="email" type="email" className="form-control center-block" style={inputStyle} placeholder="Email"/>
            </div>

            <div className="form-group">
              <input ref={input => (_password = input)} autoComplete="off" id="password-input" name="password" type="password" className="form-control center-block" style={inputStyle} placeholder="Password"/>
            </div>

            <button type="submit" className="btn btn-primary center-block text-center email-login-btn"style={{ marginBottom: '10px' }} href="#!">
              Register
            </button>

            <Link to="/login" style={{ color: '#636b6f' }}>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;