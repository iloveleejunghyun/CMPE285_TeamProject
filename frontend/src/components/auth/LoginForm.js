import React, { Fragment, useState } from "react";
import { user } from "./user";
import { host, port } from "../utils/conf";

const LoginForm = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [failed, setFailed] = useState(false);
  const { email, password } = formData;

  const onSubmit = async (e) => {
    e.preventDefault();
    props.setLoading(true);
    fetch(`http://${host}:${port}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.user.email) {
          user.userId = email;
          user.name = data.user.fname + " " + data.user.lname;
          setFailed(false);
        } else {
          setFailed(true);
        }
        props.setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        props.setLoading(false);
        setFailed(true);
      });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <div className="ui medium header">Sign Into Your Account</div>
      <form className="ui error form" onSubmit={onSubmit}>
        <div className="grouped fields">
          <div
            className={failed ? "required field error" : "required field"}
            style={{ minWidth: "100%" }}
          >
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
          <div
            className={failed ? "required field error" : "required field"}
            style={{ minWidth: "100%" }}
          >
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
};

export default LoginForm;
