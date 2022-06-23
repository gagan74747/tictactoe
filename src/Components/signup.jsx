import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default class Signup extends Component {
  state={
    username:'',
    password:''
    }
handleInput= (e)=>{
this.setState({...this.state,[e.target.name]:e.target.value})
}
handleSignup = async() => {
  try{
  const response = await fetch('http://localhost:5000/signup',{
  method:'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify(this.state),
  });
  const data = await response.json();
  if(response.status===200){
  toast.success(data.message)
  }else
  throw new Error(data.message)
  }catch(err)
  {
    toast.error(''+err)
  }
  }
render() {
return(
      <div className='container'>
        <div className="parentcontainer">
        <h1 className='mb-5'>Signup</h1>
        <form className='w-50'>
          <div className="form-outline mb-4">
            <input name='username' type="text" id="form2Example1" className="form-control" placeholder='Username' onChange={this.handleInput}/>
             </div>
            <div className="form-outline mb-4">
            <input
              name='password'
              type="password"
              id="form2Example2"
              className="form-control"
              placeholder='password'
              onChange={this.handleInput}
            />
           </div>
           <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-primary btn-block mb-4" onClick={this.handleSignup}>
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
