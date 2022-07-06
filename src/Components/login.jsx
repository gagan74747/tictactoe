import React, { Component } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import messageCleaner from '../utils/messageCleaner'
export default class Login extends Component {
  state={
  username:'',
  password:'',
  redirectToHome:false,
  showpassword:false
  }
  handleInput= (e)=>{
  this.setState({...this.state,[e.target.name]:e.target.value})
  }
  handleLogin = async() => {
  try{
  const response = await fetch('http://localhost:5000/api/login',{
  method:'POST',
  headers: {
  'Content-Type': 'application/json',
  },
  body: JSON.stringify(this.state),
  });
  const data = await response.json();
  if(response.status===200){
  toast.success(data.message,{
    toastId:'xyz'
  })
  localStorage.setItem('token',response.headers.get('x-auth-token'))
  this.setState({ ...this.state, redirect: true });
  }else
  throw new Error(data.message)
  }catch(err)
  {
    toast.error(messageCleaner("" + err),{
      toastId:'xyz'
    })
  }
  }
  render() {
    return (
      <>
      {this.state.redirect && <Navigate to="/home" replace={true} />}
      <div className='container'>
      <div className="parentcontainer ">
      <h1 className='mb-5'>Login</h1>
        <form className='w-50'>
          <div className="form-outline  mb-4">
            <input  name='username' type="text" id="form2Example1" className="form-control " placeholder='Username' onChange={this.handleInput}/>
           </div>
            <div className="form-outline mb-4 position-relative">
            <input
              type={(this.state.showpassword && 'text') || ('password')}
              name='password'
              id="form2Example2"
              className="form-control"
              placeholder='password'
              onChange={this.handleInput}
              />
           <span className='fa fa-eye eye' onClick={()=>this.setState({...this.state,showpassword:!this.state.showpassword})}></span>
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
    </>
    );
  }
}
