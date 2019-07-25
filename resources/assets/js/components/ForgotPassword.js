import React from "react";
import { Link } from "react-router-dom";

const ForgotPassword = ({ history, forgotPassword = f => f }) => {
  let _email;

  const handleSendEmail = e => {
    e.preventDefault();
    forgotPassword(_email.value);
  };

  const inputStyle = { width: '75%', marginBottom: '20px' }

  return (
    <div id="main">
      <div className="col-xs-12 col-md-4 col-md-push-3">
        <form action="" id="login-form" onSubmit={handleSendEmail} method="post" className="panel panel-default text-center" style={{ boxShadow: 'none', width: '85%', margin: '15px auto' }}>
          <div className="panel-heading" style={{ backgroundColor: '#f5f5f5' }}>
            <h3 style={{ marginTop: '10px' }}>
              Reset Password
            </h3>
          </div>

          <div className="panel-body">
            { window.location.search === '?token=invalid' ? (
              <div>
                <p className="text-danger">Token has expired.</p>
              </div>
            ) : (
              <div/>
            ) }

            <div className="form-group email-error">
              <input ref={input => (_email = input)} autoComplete="off" id="email-input" name="email" type="email"  className="form-control center-block" placeholder="Email" style={inputStyle}/>
            </div>

            <ul className="form-errors text-danger center-block" style={{ listStyle: 'none' }}></ul>

            <button type="submit" className="btn btn-primary center-block forgot-password-btn form-btn" style={{ margin: '20px auto 10px' }} href="#!">
              Send Link
            </button>

            <Link to="/" style={{ color: '#636b6f' }}>
              <button className="btn btn-default">Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;