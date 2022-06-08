import { useState, useEffect } from 'react'
let value = null;

  function App() {

  const emptyBlocks = { block1: '', block2: '', block3: '', block4: '', block5: '', block6: '', block7: '', block8: '', block9: '' }
  const [zeroOrCross, setZeroOrCross] = useState(true);
  const [blocks, setBlocks] = useState(emptyBlocks);

  const handleClick = (e) => {
    value = zeroOrCross && 'O' || 'X';
    e.target.innerHTML==='' && setBlocks({ ...blocks, [e.target.classList[1]]: value });
    e.target.innerHTML==='' && setZeroOrCross(!zeroOrCross);
  }

  function hasNullBlocks(target) {
    for (var member in target) {
        if (target[member] === '')
            return true;
    }
    return false;
}

  const checkForWin = () => {

      const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  for (let i = 0; i < lines.length; i++) {
  const [a, b, c] = lines[i];
  if (blocks[`block${a+1}`] === value && blocks[`block${b+1}`] === value && blocks[`block${c+1}`] === value) {
  window.prompt(value + " "  +  'wins');
  resetBlocks();
  return;
  }}
  if(!hasNullBlocks(blocks)) 
  {
    resetBlocks();
    window.prompt('Tie'); 
  } 
} 
   const resetBlocks=()=>{
    setBlocks(emptyBlocks);
  }
   useEffect(() => {
   setTimeout(()=>checkForWin(),1) 
   }, [blocks]);
   
   return (
    <>
            <div className='container'>
            <div className='child-container'>
              <h1 className='heading'>Tic Tac Toe</h1>
            <div className='row'>
            <span className='block block1' onClick={handleClick}>{blocks.block1}</span>
            <span className='block block2' onClick={handleClick}>{blocks.block2}</span>
            <span className='block block3' onClick={handleClick}>{blocks.block3}</span>
            </div>
            <div className='row'>
            <span className='block block4' onClick={handleClick}>{blocks.block4}</span>
            <span className='block block5' onClick={handleClick}>{blocks.block5}</span>
            <span className='block block6' onClick={handleClick}>{blocks.block6}</span>
            </div>
            <div className='row'>
            <span className='block block7' onClick={handleClick}>{blocks.block7}</span>
            <span className='block block8' onClick={handleClick}>{blocks.block8}</span>
            <span className='block block9' onClick={handleClick}>{blocks.block9}</span>
            </div>
            </div>
            <button className='resetbutton btn btn-primary' onClick={resetBlocks}>Reset</button>
            </div>
            </>
            );
            }

export default App;
