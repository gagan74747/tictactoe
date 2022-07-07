/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { socket } from "../socket";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
import messageCleaner from "../utils/messageCleaner";
import copyToClipboard from "../utils/copyToClipboard";
import queryString from 'query-string'

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
      toast.success(data.message);
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
  handleOnlineFriends = (e) => {
  e.preventDefault();
  console.log('here')
  this.setState({...this.state,toggleOnlineFriends:true});
   this.container.current.style.opacity='0.07'
  }
  closeOnlineFriendDialogue = () => {
    this.setState({...this.state,toggleOnlineFriends:false});
    this.container.current.style.opacity='1'
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
    this.getUserDetails();
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
      } else if (response.status === 307) {
        toast.error("User Not logged In");
        this.setState({ ...this.state, redirectToLogin: true });
      } else toast.error(data.message);
    } catch (err) {
      toast.error(messageCleaner("" + err));
    }
  };

  render() {
    // const search = this.props.location.search;
    // const name = new URLSearchParams(search).get("roomId");
    console.log(this.term)


    return (
      <>
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
          
          
          </div>
        )}
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
          <a href="#" style={{ fontWeight: "bold", color: "black", margin: "20px" }}
          onClick={this.handleOnlineFriends}
            >
            Online Friends
            </a>
          </form>
        </div>
      </>
    );
  }
}
export default Home;