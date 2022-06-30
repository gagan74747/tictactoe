import { Component } from "react";
import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { socket } from "../App";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import zeroAudio from '../tictactoe1.mp3'
import crossAudio from '../tictactoe2.mp3'

const customStyles = {
  content: {
    top: "20%",
    left: "49%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
const audio1 = new Audio(zeroAudio);
const audio2 = new Audio(crossAudio);

Modal.setAppElement("#root");
let value = null;
let turn = true;
let subtitle;

class Game extends Component {
constructor(){
  super()
  this.blockRef=React.createRef();
} 
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
getUserDetails =async () => {
try{
const response = await fetch("http://localhost:5000/api/game", {
method: "POST",
headers: {
"Content-Type": "application/json",
'token':localStorage.getItem('token')
},
body:JSON.stringify({
})});
const data = await response.json();
if (response.status === 200) {
console.log(data.message);
socket.emit("onGameComponentMount");
}else if(response.status===400)
{
toast.error('User not joined in any room');
this.setState({ ...this.state, redirectToHome: true });
}
else if(response.status === 307){
toast.error('User Not logged In');
this.setState({ ...this.state, redirectToLogin: true });
}
else{
toast.error(data.message);
}}catch (err) {
toast.error("" + err);
}}
componentDidMount() { 
this.getUserDetails();
socket.on("message", (ar) => {
this.setState(ar);
value = ar.value;
});
socket.on("setturn", () => {
turn = true;
});
socket.on("inWaiting", () => {
this.setState({ ...this.state, startGameModal: true });
});
socket.on("startGame", () => {
this.setStartGame();
});
socket.on("anotherplayerdisconnected", () =>
console.log("anotherplayerdisconnected")
)}
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
redirectToLogin: false,
redirectToHome:false
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
value === 'X' && audio2.play();
value === 'O' && audio1.play();
}};
hasNullBlocks(target) {
for (var member in target) {
if (target[member] === "") return true;
}
return false;
}
winningDesign(a,b,c){
const block1=document.getElementsByClassName(`block${a+1}`)[0];
const block2=document.getElementsByClassName(`block${b+1}`)[0];
const block3=document.getElementsByClassName(`block${c+1}`)[0];
const winner = block1.innerHTML;
for(let i=1;i<=10;i++){
setTimeout((i)=>{
  if(i%2===0){
    block1.innerHTML='Tic';block1.style.color='Orange'
    block2.innerHTML='Tac';block2.style.color='Orange'
    block3.innerHTML='Toe';block3.style.color='Orange'
    }
    if(i%2!==0){
    block1.innerHTML=winner;block1.style.color='red'
    block2.innerHTML=winner;block2.style.color='red'
    block3.innerHTML=winner;block3.style.color='red' 
    }
},i*100,i);
}};

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
this.winningDesign(a,b,c);
this.openModal();
socket.emit("leaveRoom");
turn = true;
return;
}}
if (!this.hasNullBlocks(this.state.blocks)) {
value = false;
this.openModal();
socket.emit("leaveRoom");
turn = true;
}
}
componentDidUpdate(prevProps, prevState) {
if(this.state.blocks !== prevState.blocks) {
setTimeout(() => this.checkForWin(), 1);
}}
render() {
console.log(this.state.blocks)
return (
<>
{this.state.redirectToHome && <Navigate to="/home" replace={true} />}
{this.state.redirectToLogin && <Navigate to="/" replace={true} />}
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
<div className="container ">
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
      <span className="block block4" ref={this.blockRef} onClick={this.handleClick}>
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
    );
  }
}
export default Game;
