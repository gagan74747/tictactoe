import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default class Login extends Component {
  state={
  username:'',
  password:''
  }
  handleInput= (e)=>{
  this.setState({...this.state,[e.target.name]:e.target.value})
  }
  handleLogin = async() => {
  try{
  const response = await fetch('http://localhost:5000/login',{
  method:'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify(this.state),
  });
  const data = await response.json();
  if(response.status===200){
  toast.success(data.message)
  console.log(response.headers.get('x-auth-token'));
  // localStorage.setItem('x-auth-token',response.headers.x-auth-token)
  }else
  throw new Error(data.message)
  }catch(err)
  {
    toast.error(''+err)
  }
  }
  render() {
    return (
      <div className='container'>
      <div className="parentcontainer ">
      <h1 className='mb-5'>Login</h1>
        <form className='w-50'>
          <div className="form-outline  mb-4">
            <input  name='username' type="text" id="form2Example1" className="form-control " placeholder='Username' onChange={this.handleInput}/>
           </div>
            <div className="form-outline mb-4">
            <input
              type="password"
              name='password'
              id="form2Example2"
              className="form-control"
              placeholder='password'
              onChange={this.handleInput}
            />
           
          </div>

          <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-primary btn-block mb-4" onClick={this.handleLogin}>
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
