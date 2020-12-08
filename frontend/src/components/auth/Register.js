import React, {Fragment, useState} from 'react'
import { Link, Redirect } from 'react-router-dom';

import {user} from './user'

const Register = () => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: ''
      });
      const onSubmit = e => {
        e.preventDefault();
        
        setLoading(true);
        setTimeout(() => {
            user.userId = "test@email.com";
            setLoading(false);
        }, 1000);
        console.log(formData);
      };
    
      const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
      return user.userId ? (
          <Redirect to="/" />
        ) : (
        <Fragment>
            <div
                className={
                  loading
                    ? 'ui loading segment'
                    : 'ui segment'
                }
                style={{ background: 'white' }}
              >
        <form className="ui form" onSubmit={onSubmit}>
          <div className="two fields">
            <div className="required field">
              <label>First Name</label>
              <input
                name="fname"
                placeholder="First Name"
                type="text"
                onChange={onChange}
                required
              />
            </div>
    
            <div className="required field">
              <label>Last Name</label>
              <input
                name="lname"
                placeholder="Last Name"
                type="text"
                onChange={onChange}
                required
              />
            </div>
          </div>
    
          <div className="required field">
            <label>Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              type="email"
              autoComplete="username"
              onChange={onChange}
              required
            />
          </div>
    
          <div className="required field">
            <label>Password</label>
            <input
              name="password"
              placeholder="Enter your password"
              type="password"
              autoComplete="new-password"
              onChange={onChange}
              required
            />
          </div>
    
          <button className="fluid ui primary button" type="submit">
            Register Account
          </button>
          <Link to='/login'>Already have an account? Login</Link>
        </form>
        </div>
        </Fragment>
      );
}

export default Register
