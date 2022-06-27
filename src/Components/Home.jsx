import React, { Component } from "react";
import { socket } from "../App";
import { Navigate } from "react-router-dom";
import Modal from "react-modal";
import { toast } from "react-toastify";
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
Modal.setAppElement("#root");
let subtitle;
export default class Home extends Component {
  state = {
    genratedRoomId: "12345",
    inputRoomId: null,
    redirectToGame: false,
    redirectToLogin: false,
    modalIsOpen: false,
  };
  openModal = () => {
    this.setState({ ...this.state, modalIsOpen: true });
  };

  afterOpenModal = () => {
    subtitle.style.color = "#f00";
  };

  closeModal = () => {
    this.setState({ ...this.state, modalIsOpen: false });
  };
  generateRoomId = () => {
    const digits = "0123456789";
    let genratedRoomId = "";
    for (let i = 0; i < 4; i++) {
      genratedRoomId += digits[Math.floor(Math.random() * 10)];
    }
    this.setState({ genratedRoomId: genratedRoomId });
  };
  joinRoom = (e, roomId) => {
    e.preventDefault();
    roomId && socket.emit("joinRoom", roomId);

    socket.on("roomAvailable", () => {
      this.setState({ ...this.state, redirectToGame: true });
    });
    socket.on("roomFull", () => {
      this.openModal();
    });
  };
  componentDidMount() {
    this.getUserDetails()
  }
  getUserDetails = async () => {
    try {
      const response = await fetch("http://localhost:5000/home", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'token':localStorage.getItem('token')
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success(data.username);
        
      } else {
        toast.error('User Not logged In');
        this.setState({ ...this.state, redirectToLogin: true });
      }
    } catch (err) {
      toast.error("" + err);
    }
  };

  render() {
    return (
      <>
        {this.state.redirectToGame && <Navigate to="/game" replace={true} />}
        {this.state.redirectToLogin && <Navigate to="/" replace={true} />}
        <Modal
          isOpen={this.state.modalIsOpen}
          // onAfterOpen={this.afterOpenModal}
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
        <div className="d-flex flex-column justify-content-center align-items-center container ">
          <form className="d-flex flex-column justify-content-center align-items-center form p-5 ">
            <div className="form-outline  ">
              <h1 className="text-center  mb-4">Enter Room Id</h1>
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

            <h5 className="text-center mt-4" onClick={this.generateRoomId}>
              Create Room?
            </h5>
            {this.state.genratedRoomId !== "12345" && (
              <>
                <p>{this.state.genratedRoomId}</p>{" "}
                <button
                  type="submit"
                  className="btn btn-primary btn-sm mb-5"
                  onClick={(e) => this.joinRoom(e, this.state.genratedRoomId)}
                >
                  JOIN
                </button>
              </>
            )}
          </form>
        </div>
      </>
    );
  }
}
