import React, {Fragment, useState} from 'react'
import { Redirect, Link } from 'react-router-dom';

import LoginForm from './LoginForm'
import {user} from './user'

const Login = () => {
    const [loading, setLoading] = useState(false)
    return user.userId ? (
        <Redirect to="/" />
      ) : (
        <Fragment>
          <div
            className={
              loading
                ? 'ui loading placeholder segment'
                : 'ui placeholder segment'
            }
            style={{ background: 'white' }}
          >
            <div className="ui two column very relaxed stackable grid">
              <div className="column">
                <LoginForm setLoading={setLoading} />
              </div>
              <div className="middle aligned column">
                <Link to="/register">
                  <div className="ui big button">
                    <i className="signup icon" />
                    Sign Up
                  </div>
                </Link>
              </div>
            </div>
    
            <div className="ui vertical divider">Or</div>
          </div>
        </Fragment>
      );
}

export default Login
