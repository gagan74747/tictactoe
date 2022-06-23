import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class Signup extends Component {
signUp=()=>{
    fetch('http://localhost:5000/signup',{
        
    })
}
  render() {
    return (
        <div className='container'>
        <div className="parentcontainer">
        <form className='w-50'>
          <div className="form-outline mb-4">
            <input type="email" id="form2Example1" className="form-control" placeholder='Email'/>
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
            <button type="button" className="btn btn-primary btn-block mb-4" onClick={}>
              Sign up
            </button>
          </div>
          <div className="text-center">
            <p>
              Already a member? <Link to="/">Login</Link>
            </p>
          </div>
        </form>
      </div>
      </div>
    )
  }
}
