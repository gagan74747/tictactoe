import { Component } from "react";
import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import {socket}  from "../App";
const customStyles = {
  content: {
  top: "20%",
  left: "49%",
  right: "auto",
  bottom: "auto",
  marginRight: "-50%",
  transform: "translate(-50%, -50%)",
  }};
Modal.setAppElement("#root");
let value = null;
let turn = true;
let subtitle;

class Game extends Component {
openModal = () => {
this.setState({ ...this.state, modalIsOpen: true });
};

afterOpenModal = () => {
subtitle.style.color = "#f00";
};

  closeModal = () => {
  this.setState({ ...this.state, modalIsOpen: false });
  };
  setStartGame = () => {
  this.setState({ ...this.state, startGameModal: false });
  };
  componentDidMount() {
  socket.emit('onGameComponentMount');
  socket.on("message", (ar) => {
  this.setState(ar);
  value = ar.value;
  });
  socket.on("setturn", () => {
  turn = true;
  });
  socket.on("inWaiting", () => {
  this.setState({ ...this.state, startGameModal: true })
  });
  socket.on('startGame',()=>{
    this.setStartGame();
  })
  socket.on('anotherplayerdisconnected',()=>console.log('anotherplayerdisconnected'));
  }

  emptyBlocks = {
    block1: "",
    block2: "",
    block3: "",
    block4: "",
    block5: "",
    block6: "",
    block7: "",
    block8: "",
    block9: "",
  };
  state = {
    zeroOrCross: true,
    blocks: this.emptyBlocks,
    modalIsOpen: false,
    startGameModal: false,
  };

    handleClick = (e) => {
    if (turn && e.target.innerHTML === "") {
    value = (this.state.zeroOrCross && "O") || "X";
    this.setState({
    zeroOrCross: !this.state.zeroOrCross,
    blocks: { ...this.state.blocks, [e.target.classList[1]]: value },
    });
    e.target.innerHTML === "" &&
    socket.emit("opponentTurnPayload", {
    zeroOrCross: !this.state.zeroOrCross,
    blocks: { ...this.state.blocks, [e.target.classList[1]]: value },
    value,
    });
    turn = false;
    socket.emit("nextturn");
    }
  };
    hasNullBlocks(target) {
    for (var member in target) {
    if (target[member] === "") return true;
    }
    return false;
  }

    checkForWin = () => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (
    this.state.blocks[`block${a + 1}`] === value &&
    this.state.blocks[`block${b + 1}`] === value &&
    this.state.blocks[`block${c + 1}`] === value
    ){
    this.openModal();
    socket.emit("leaveRoom");
    turn = true;
    return;
    }}
    if (!this.hasNullBlocks(this.state.blocks)) {
    value = false;
    this.openModal();
    socket.emit("leaveRoom")
    turn = true;
    }
  };
  componentDidUpdate(prevProps, prevState) {
  if (this.state.blocks !== prevState.blocks) {
  setTimeout(() => this.checkForWin(), 1);
  }}

  render() {
  return (
  <>
  <Modal
  isOpen={this.state.modalIsOpen}
          // onAfterOpen={this.afterOpenModal}
  onRequestClose={this.closeModal}
  style={customStyles}
  contentLabel="Example Modal"
  shouldCloseOnOverlayClick={false}
  >
          <h5 style={{ textAlign: "center" }}>RESULT..!!</h5>
          {(value && <p style={{ textAlign: "center" }}>{value} Wins</p>) || (
            <p style={{ textAlign: "center" }}>Tie</p>
          )}
        <Link to="/">
        <h6>
        Start New Game{" "}
        <i className="fa fa-refresh" aria-hidden="true"></i>
        </h6>
        </Link>
        </Modal>
        <Modal
          isOpen={this.state.startGameModal}
          onRequestClose={this.setStartGame}
          style={customStyles}
          contentLabel="Example Modal"
          shouldCloseOnOverlayClick={false}
        >
       <h5>Waiting for another player to join..</h5>
        </Modal>
        <h1 className="heading">Tic Tac Toe</h1>
        <div className="container">
        <div className="child-container">
        <div className="row">
        <span className="block block1" onClick={this.handleClick}>
        {this.state.blocks.block1}
        </span>
        <span className="block block2" onClick={this.handleClick}>
        {this.state.blocks.block2}
        </span>
        <span className="block block3" onClick={this.handleClick}>
        {this.state.blocks.block3}
        </span>
        </div>
        <div className="row">
        <span className="block block4" onClick={this.handleClick}>
        {this.state.blocks.block4}
        </span>
        <span className="block block5" onClick={this.handleClick}>
        {this.state.blocks.block5}
        </span>
        <span className="block block6" onClick={this.handleClick}>
        {this.state.blocks.block6}
        </span>
        </div>
        <div className="row">
        <span className="block block7" onClick={this.handleClick}>
        {this.state.blocks.block7}
        </span>
        <span className="block block8" onClick={this.handleClick}>
        {this.state.blocks.block8}
        </span>
        <span className="block block9" onClick={this.handleClick}>
        {this.state.blocks.block9}
        </span>
        </div>
        </div>
        </div>
        </>
        )}}

export default Game;
