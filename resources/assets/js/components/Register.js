import React from "react";
import { Link } from "react-router-dom";

const Register = ({ history, registerUser = f => f }) => {
  let _email, _password, _name;

  const handleLogin = e => {
    e.preventDefault();
    registerUser(_name.value, _email.value, _password.value);
  };

  const inputStyle = { width: '70%', marginBottom: '20px' }

  return (
    <div id="main">
      <div className="col-xs-12 col-md-4 col-md-push-3">
        <form action="" id="login-form" onSubmit={handleLogin} method="post" className="text-center" style={{ border: '1px solid #e0e0e0', width: '80%', margin: '30px auto', paddingBottom: '20px', background: '#fafafa' }}>
          <h3 style={{ boxSizing: 'border-box', margin: 0, padding: '25px', background: '#f5f5f5 ' }}>
            Register
          </h3>

          <hr style={{ marginTop: 0, borderColor: '#e0e0e0' }}/>

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

          <Link to="/login">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;