import React, { Component } from "react";
import socket, { socketEvents } from "../socket";
import { Navigate } from "react-router-dom";

export default class Home extends Component {
  state = {
    genratedRoomId: "12345",
    inputRoomId: null,
    redirect: false,
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
    roomId && socketEvents.joinRoom(roomId);
    this.setState({ ...this.state, redirect: true });
  };

  render() {
    return (
      <>
        { this.state.redirect && <Navigate to="/game" replace={true} /> }
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
