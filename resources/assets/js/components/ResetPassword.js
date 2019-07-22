import React from "react";
import { Link } from "react-router-dom";

const ResetPassword = ({ history, resetPassword = f => f }) => {
  let _password, _confirmPassword;

  const handleResetPassword = e => {
    e.preventDefault();
    resetPassword(_password.value, _confirmPassword.value);
  };

  const inputStyle = { width: '75%', marginBottom: '20px' }

  return (
    <div id="main">
      <div className="col-xs-12 col-md-4 col-md-push-3">
        <form action="" id="login-form" onSubmit={handleResetPassword} method="post" className="panel panel-default text-center" style={{ boxShadow: 'none', width: '85%', margin: '15px auto' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f5f5f5' }}>
            <h3 style={{ marginTop: '10px' }}>
              Reset Password
            </h3>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <input ref={input => (_password = input)} autoComplete="off" id="password-input" name="password" type="password" className="form-control center-block" placeholder="Password" style={inputStyle}/>
            </div>

            <div className="form-group">
              <input ref={input => (_confirmPassword = input)} autoComplete="off" id="confirm-password-input" name="password" type="password" className="form-control center-block" placeholder="Confirm Password" style={inputStyle}/>
            </div>

            <button type="submit" className="btn btn-primary center-block forgot-password-btn" style={{ margin: '20px auto 10px' }} href="#!">
              Confirm
            </button>

            <Link to="/" style={{ color: '#636b6f' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;