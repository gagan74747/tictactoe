import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    return (
      <div className='d-flex flex-column justify-content-center align-items-center container '>
        <form className='d-flex flex-column justify-content-center align-items-center form p-5 '> 

  <div className="form-outline  ">
   <h1 className='text-center  mb-4'>Enter Room Id</h1>
  </div>

  
  <div className="form-outline mt-2 mb-4 w-25">
    <input type="text" id="form1Example2" className="form-control" />
    
  </div>

  <div className="row  d-flex justify-content-center ">
   
    <div className='text-center mb-5'>
    <button type="submit" className="btn btn-primary btn-block mb-5">JOIN</button>
    </div>
  </div>

 
  <h5 className='text-center mt-4'>Create Room?</h5>
</form>
      </div>
    )
  }
}
