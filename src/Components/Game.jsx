import { Component, } from 'react'
import { io } from "socket.io-client";

let value = null;
let turn =true;

class Game extends Component {

componentDidMount(){
this.socket = io("http://localhost:5000");
this.socket.on("connect", () => {
this.socket.on('message', (ar) => { this.setState(ar);value = ar.value})
this.socket.on('setturn', () => { turn=true})
this.socket.on('onReset',() => {
this.setState({ zeroOrCross:true, blocks: this.emptyBlocks });
turn=true;
})})}

emptyBlocks = { block1: '', block2: '', block3: '', block4: '', block5: '', block6: '', block7: '', block8: '', block9: '' }
state = {
zeroOrCross: true,
blocks: this.emptyBlocks,
};

handleClick = (e) => {
if(turn && e.target.innerHTML === '')
{
value = this.state.zeroOrCross && 'O' || 'X';
this.setState({ zeroOrCross: !this.state.zeroOrCross, blocks: { ...this.state.blocks, [e.target.classList[1]]: value } });
e.target.innerHTML === '' && this.socket.emit("hello", { zeroOrCross: !this.state.zeroOrCross, blocks: { ...this.state.blocks, [e.target.classList[1]]: value },value });
turn=false;
this.socket.emit('nextturn')
}}

hasNullBlocks(target) {
for (var member in target) {
if (target[member] === '')
return true;
}
return false;
}

checkForWin = () => {
console.log('from check for win');
const winningConditions = [
[0, 1, 2],
[3, 4, 5],
[6, 7, 8],
[0, 3, 6],
[1, 4, 7],
[2, 5, 8],
[0, 4, 8],
[2, 4, 6]
];
for (let i = 0; i < winningConditions.length; i++) {
const [a, b, c] = winningConditions[i];
if (this.state.blocks[`block${a + 1}`] === value && this.state.blocks[`block${b + 1}`] === value && this.state.blocks[`block${c + 1}`] === value) {
window.prompt(value + " " + 'wins');
this.resetBlocks();
return;
}}
if (!this.hasNullBlocks(this.state.blocks)) {
this.resetBlocks();
window.prompt('Tie');
}}

resetBlocks = () => {
this.setState({ zeroOrCross:true, blocks: this.emptyBlocks });
turn=true;
this.socket.emit('resetState');
}

componentDidUpdate(prevProps, prevState) {
if (this.state.blocks !== prevState.blocks) {
setTimeout(() => this.checkForWin(), 1)
}}

render() {
return (
<>
<div className='container'>
<div className='child-container'>
<h1 className='heading'>Tic Tac Toe</h1>
<div className='row'>
<span className='block block1' onClick={this.handleClick}>{this.state.blocks.block1}</span>
<span className='block block2' onClick={this.handleClick}>{this.state.blocks.block2}</span>
<span className='block block3' onClick={this.handleClick}>{this.state.blocks.block3}</span>
</div>
<div className='row'>
<span className='block block4' onClick={this.handleClick}>{this.state.blocks.block4}</span>
<span className='block block5' onClick={this.handleClick}>{this.state.blocks.block5}</span>
<span className='block block6' onClick={this.handleClick}>{this.state.blocks.block6}</span>
</div>
<div className='row'>
<span className='block block7' onClick={this.handleClick}>{this.state.blocks.block7}</span>
<span className='block block8' onClick={this.handleClick}>{this.state.blocks.block8}</span>
<span className='block block9' onClick={this.handleClick}>{this.state.blocks.block9}</span>
</div>
</div>
</div>
</>
)}}

export default Game;
