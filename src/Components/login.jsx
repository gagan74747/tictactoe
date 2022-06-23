import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Login extends Component {
  render() {
    return (
        <div className='container'>
      <div className="parentcontainer ">
        <form className='w-50'>
          <div className="form-outline  mb-4">
            <input type="email" id="form2Example1" className="form-control "  placeholder='Email'/>
           </div>

          <div className="form-outline mb-4">
            <input
              type="password"
              id="form2Example2"
              className="form-control"
              placeholder='password'
            />
           
          </div>

          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-primary btn-block mb-4">
              Sign in
            </button>
          </div>
          <div className="text-center">
            <p>
              Not a member? <Link to="/signup">Register</Link>
            </p>
          </div>
        </form>
      </div>
      </div>
    );
  }
}
