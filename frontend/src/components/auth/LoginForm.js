import React, {Fragment, useState} from 'react'
import {user} from './user'

const LoginForm = (props) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
      const { email, password } = formData;
    
      const onSubmit = async e => {
        e.preventDefault();
        props.setLoading(true);
        setTimeout(() => {
            user.userId = "test@email.com";
            props.setLoading(false);
        }, 1000);
      };
    
      const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      return (
        <Fragment>
          <div className="ui medium header">
            Sign Into Your Account
          </div>
          <form className="ui form" onSubmit={onSubmit}>
            <div className="grouped fields">
              <div className=" required field" style={{ minWidth: '100%' }}>
                <label>Email:</label>
                <input
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={onChange}
                  autoComplete="username"
                />
              </div>
              <div className="required field" style={{ minWidth: '100%' }}>
                <label>Passwrod</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={onChange}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button className="fluid ui primary button" type="submit">
              Log In
            </button>
          </form>
        </Fragment>
      );
}

export default LoginForm
