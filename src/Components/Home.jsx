/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { socket } from "../socket";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import messageCleaner from "../utils/messageCleaner";
import copyToClipboard from "../utils/copyToClipboard";

const customStyles = {
  content: {
    top: "40%",
    left: "49%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
let myusername;
Modal.setAppElement("#root");
let subtitle;
class Home extends Component {
   queryParams = new URLSearchParams(window.location.search)
   roomIdFromParams = this.queryParams.get("roomId")
   container=React.createRef(null);
  state = {
    genratedRoomId: "",
    inputRoomId: null,
    redirectToGame: false,
    redirectToLogin: false,
    modalIsOpen: false,
    toggleInviteFriends: false,
    toggleOnlineFriends: false,
    alreadyInRoomModal:{value:false,roomId:null},
    playersOnline:[]
  };
  openModal = () => {
    this.setState({ ...this.state, modalIsOpen: true });
  };
  pushUserToRoom = async (roomId) => {
    const response = await fetch("http://localhost:5000/api/joinRoom", {
      method: "POST",
      body: JSON.stringify({
        roomId,
      }),
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      socket.emit("joinRoom", roomId, myusername);
      socket.on("roomAvailable", () => {
        this.setState({ ...this.state, redirectToGame: true });
      });
      socket.on("roomFull", () => {
        this.openModal();
      });
    } else {
      toast.error(data.message);
    }
  };
  afterOpenModal = () => {
    subtitle.style.color = "#f00";
  };
  closeModal = () => {
    this.setState({ ...this.state, modalIsOpen: false });
  };
  handleAlreadyInRoomModal(roomId){
    this.setState({alreadyInRoomModal:{value:true,
    roomId}}
    )
    this.container.current.style.opacity='0.07';
    this.container.current.style.pointerEvents='none';
  }
  handleOnlinePlayers=(roomId)=>{
    this.pushUserToRoom(roomId)
  }
  handleAlreadyInRoom=()=>{
   this.pushUserToRoom(this.state.alreadyInRoomModal.roomId)
  }
  handleQuitRoom=()=>{
    socket.emit('quitRoom',this.state.alreadyInRoomModal.roomId);
  }
  handleOnlineFriends = (e) => {
  e.preventDefault();
  this.setState({...this.state,toggleOnlineFriends:true});
   this.container.current.style.opacity='0.07';
  }
  closeOnlineFriendDialogue = () => {
    this.setState({...this.state,toggleOnlineFriends:false});
    this.container.current.style.opacity='1';
  }
  generateRoomId = () => {
    const digits = "0abc1def3gH4IJ5KL6M8N7OP9qS";
    let genratedRoomId = "";
    for (let i = 0; i < 4; i++) {
      genratedRoomId += digits[Math.floor(Math.random() * 100) % 27];
    }
    this.setState({
      ...this.state,
      toggleInviteFriends: !this.state.toggleInviteFriends,
      genratedRoomId: genratedRoomId,
    });
  };
  joinRoom = (e, roomId) => {
    e.preventDefault();
    roomId && this.pushUserToRoom(roomId);
  };
  componentDidMount() {
    socket.on('updatedOnlinePlayers',(playersOnline)=>{
      this.setState({playersOnline})
    })
    socket.on('refreshPage',()=>{
    window.location.reload()})
    this.getUserDetails();
  }
  componentWillUnmount(){
    socket.off('refreshPage')
    socket.off('updatedOnlinePlayers');
  }
  getUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/home", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        myusername = data.username;
        if(data.roomId)
        this.handleAlreadyInRoomModal(data.roomId);
        else
        this.roomIdFromParams && this.pushUserToRoom(this.roomIdFromParams);
        document.getElementsByClassName('parentloader')[0].style.display='none';
      } else if (response.status === 307) {
        toast.error("User Not logged In");
        this.setState({ ...this.state, redirectToLogin: true });
      } else toast.error(data.message);
    } catch (err) {
      toast.error(messageCleaner("" + err));
      document.getElementsByClassName('parentloader')[0].style.display='none';
    }
  };

  render() {
    // const search = this.props.location.search;
    // const name = new URLSearchParams(search).get("roomId");
   


    return (
      <>
      <div className="parentloader" >
  <div className="spinner-border spinner">
  </div>
</div>
        {this.state.redirectToGame && <Navigate to="/game" replace={true} />}
        {this.state.redirectToLogin && <Navigate to="/" replace={true} />}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          shouldCloseOnOverlayClick={false}
        >
          <h5 style={{ textAlign: "center" }}>
            ROOM FULL
            <br />
            Join Another Room
          </h5>
          <div className="text-center">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                this.closeModal();
              }}
            >
              Close
            </button>
          </div>
        </Modal>
        {this.state.toggleOnlineFriends && (
          <div className="online-friends">
          <h3 className='text-center' style={{fontSize:'2rem',overflow:'auto'}}>in Waiting...</h3>
            <span className="fa fa-times close-icon" style={{cursor:'pointer'}} onClick={this.closeOnlineFriendDialogue}></span>
          {this.state.playersOnline.length>0 &&  this.state.playersOnline.map((player)=>{
             return (
              <><div  className='d-flex justify-content-between p-3' key={player.users[0].username}>
    <span>{player.users[0].username}</span>
    <button className='btn btn-sm btn-success' onClick={()=>this.handleOnlinePlayers(player.roomId)}>JOIN</button>
    </div></>)
          })}
        </div>
          
        )}
         {this.state.alreadyInRoomModal.value && <div className='in-room-modal  d-flex flex-column align-items-center justify-content-center' ><h1 style={{cursor:'pointer'}} className='text-center' onClick={this.handleAlreadyInRoom}>Continue to room {" "}{this.state.alreadyInRoomModal.roomId}</h1>
         <button className='btn btn-danger btn-sm mt-4' onClick={this.handleQuitRoom}>Leave</button>
         </div>}
        <div className="d-flex flex-column justify-content-center align-items-center container" ref={this.container}>
          <form className="d-flex flex-column justify-content-center align-items-center form p-5 ">
            <div className="form-outline  ">
              <h1 className="text-center mb-4">Enter Room Id</h1>
            </div>
            <div className="form-outline mt-2 mb-4 w-25">
              <input
                type="text"
                id="form1Example2"
                className="form-control"
                onChange={(e) => {
                  this.setState({ ...this.state, inputRoomId: e.target.value });
                }}
              />
            </div>

            <div className="row  d-flex justify-content-center ">
              <div className="text-center mb-5">
                <button
                  type="submit"
                  className="btn btn-primary btn-block mb-5"
                  onClick={(e) => this.joinRoom(e, this.state.inputRoomId)}
                >
                  JOIN
                </button>
              </div>
            </div>

            <h5
              className="text-center mt-4 mb-2"
              style={{ cursor: "pointer" }}
              onClick={this.generateRoomId}
            >
              Invite Friends?
            </h5>
            {this.state.toggleInviteFriends && (
              <>
                <div className="invite-link m-3">
                  <p className="link ">
                    http://localhost:3000/home?roomId=
                    {this.state.genratedRoomId}
                  </p>
                  <p
                    className="copy-link btn btn-success "
                    onClick={(e) => {
                      copyToClipboard(e.target.previousSibling.innerHTML);
                      toast.success("Link Copied");
                    }}
                  >
                    Copy
                  </p>
                </div>{" "}
                <button
                  type="submit"
                  className="btn btn-primary mb-5"
                  onClick={(e) => this.joinRoom(e, this.state.genratedRoomId)}
                >
                  JOIN
                </button>
              </>
            )}
         <div className='d-flex justify-content-center text-center'>
          <a href="#" style={{ fontWeight: "bold", color: "black", margin: "20px" }}
          onClick={this.handleOnlineFriends}
            >
            Online Friends
            </a></div>
          </form>
        </div>
      </>
    );
  }
}
export default Home;