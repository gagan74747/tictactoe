import { Component } from "react";
import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { socket } from "../socket";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import zeroAudio from '../tictactoe1.mp3'
import crossAudio from '../tictactoe2.mp3';
import winningAudio from '../tictactoewin.mp3'
import messageCleaner from '../utils/messageCleaner'
import jwt from 'jwt-decode';

const user_id = localStorage.getItem('token') && jwt(localStorage.getItem('token'))._id;
let subtitle;
const customStyles = {
  content: {
    top: "20%",
    left: "49%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  }};
const audio1 = new Audio(zeroAudio);
const audio2 = new Audio(crossAudio);
const audio3 = new Audio(winningAudio);
Modal.setAppElement("#root");

class Game extends Component {
constructor(){
  super()
  this.blockRef=React.createRef();
  this.turn = false;
  this.value = null;
  this.turndesign=0;
  this.Interval=null;
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
  redirectToLogin: false,
  redirectToHome:false,
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

handleClick = (e) => {
  if ((this.turn === user_id) && e.target.innerHTML === "") {
  this.value = (this.state.zeroOrCross && "O") || "X";
  this.setState({
  blocks: { ...this.state.blocks, [e.target.classList[1]]: this.value },
  });
  socket.emit("opponentTurnPayload", {
  zeroOrCross: !this.state.zeroOrCross,
  blocks: { ...this.state.blocks, [e.target.classList[1]]: this.value },
  value:this.value,
  },user_id);
  this.turn = false;
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
  this.state.blocks[`block${a + 1}`] === this.value &&
  this.state.blocks[`block${b + 1}`] === this.value &&
  this.state.blocks[`block${c + 1}`] === this.value
  ){
  this.winningDesign(a,b,c);
  this.openModal();
  document.getElementsByClassName('turn-selector')[0].style.display='none'
  socket.emit("leaveRoom",user_id);
  audio3.play();
  return;
  }}
  if (!this.hasNullBlocks(this.state.blocks)) {
  this.value = false;
  this.openModal();
  document.getElementsByClassName('turn-selector')[0].style.display='none'
  socket.emit("leaveRoom",user_id);
  audio3.play();
  }
  this.value === 'X' && audio2.play();
  this.value === 'O' && audio1.play();}

componentDidMount() { 
  socket.on('refreshPage',(message)=>{
    toast.error(message);
    setTimeout(()=>{
      window.location.reload();
    },1000)
   })
this.Interval = setInterval(()=>{
  if(this.turndesign % 3 === 0)
 document.getElementsByClassName('turn-design')[0].innerHTML = '.';
  else if(this.turndesign % 3 === 1)
 document.getElementsByClassName('turn-design')[0].innerHTML = '..'
  else if(this.turndesign % 3 === 2)
 document.getElementsByClassName('turn-design')[0].innerHTML = '...'
  this.turndesign++;
  if(this.turndesign>3)this.turndesign=0;
},1000);

socket.on('connect',()=>{
console.log('connect')
socket.emit('gameComponentRefresh',localStorage.getItem('token'),socket.emit);

socket.on('afterGameComponentRefresh',(message)=>{
  if(messageCleaner(message) === 'toHome'){
  this.setState({...this.state,redirectToHome:true});
  }
  else if(messageCleaner(message) === 'toLogin')
  {
  this.setState({...this.state,redirectToLogin:true});
  toast.error('User Not logged in');
  }
  else{
  socket.emit("onGameComponentMount")//already writen below same event of socket.emit(ongamecomponentmount) and it also runs on componentdidmount but already socket from backend is in
  }// progress due to onGameComponentrefresh so server not catch gamecomponentmount event and when it finishes the work ,we know gamecomponentmount not fire again,so to fire after 
  }) //gamecomponentrefresh finishes its work we can wrap gamecomponentmount event in setTimeout and it works also  but it is not a better way for production levels thats why written in 
  }); //else and below written socket.ongamecomponentmount not works as already explained so have to additionally write it here

socket.emit("onGameComponentMount");// socket.onconnect events fires only on refresh ,so on room joining from home and redirecting to game we have to fire another socket.ongamecomponentmount as socket.onconnect not fires in this situation
socket.on("message", (gamedata,turn) => {  
this.setState(gamedata);
this.value = gamedata.value;
this.turn=turn;
});

socket.on('opponentjoined',(username)=>{
  toast.success(username + 'joined',{
    toastId:1234
  });
})
socket.on("inWaiting", () => {
document.getElementsByClassName('parentloader')[0].style.display='none'
this.setState({ ...this.state, startGameModal: true })});

socket.on("startGame", (gamedata,turn) => { 
this.turn = turn;
document.getElementsByClassName('parentloader')[0].style.display='none';
document.getElementsByClassName('turn-selector')[0].style.display='block';
if(gamedata) 
return this.setState({...gamedata,startGameModal: false });
this.setStartGame();
});

socket.on("anotherplayerdisconnected", () =>
console.log("anotherplayerdisconnected")
)}

componentWillUnmount(){
  clearInterval(this.Interval)}

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
onRequestClose={this.closeModal}
style={customStyles}
contentLabel="Example Modal"
shouldCloseOnOverlayClick={false}
 >
<h5 style={{ textAlign: "center" }}>RESULT..!!</h5>
{(this.value && <p style={{ textAlign: "center" }}>{(this.turn === user_id && 'You Lost') ||('You Win')}</p>) || (
<p style={{ textAlign: "center" }}>Tie</p>
)}
<Link to="/home">
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
<div className="container position-relative">
<div className="parentloader" >
  <div className="spinner-border spinner">
  </div>
</div>
<div className="child-container">
  <div className='turn-selector' >
{(this.turn === user_id && 'Your turn') || "Waiting For Opponent's Turn"}<span className='turn-design'></span>
  </div>
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
