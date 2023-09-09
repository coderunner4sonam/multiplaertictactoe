import { useEffect, useState } from 'react';
import logo from './logo.svg';

// length input to take n
// rows & colms
// length defined with n
// function to generate empty board
// loop iterate n===length
// Dynamic Board
// particular row col click check rowInd & COlInd
// set X & O
// check if double click on particular rowInd & COlInd it changes X,O
// check win , if row , col is same , diagonally

function App() {
  const initialBoard = [['','',''],['','',''],['','','']]
  const [length, setLength]=useState(3);
  const [board, setBoard]=useState(initialBoard);
  const [currentPlayer, setCurrentPlayer]=useState("X");
  const [win, setWin]=useState(false);
  const [draw, setDraw]=useState(false);

  function generateBoard (n){
    const newBoard = [];  
    for(let i=0; i<n; i++){
      let rowArray = [];
      for(let j=0; j<n; j++){
        rowArray.push("");
      }
     
      newBoard.push(rowArray);
      setBoard(newBoard)
  
    }
  }
  console.log(board)  
  function handleClick (RowIndx,ColIndx){
    if(board[RowIndx][ColIndx]!=="")return;

    let newBoard = board.map((Row)=>[...Row]);
    newBoard[RowIndx][ColIndx]=currentPlayer;
    setBoard(newBoard);
    
    if(checkWin(newBoard)){
      setWin(true);
      return;
    }
    if(checkDrawn(newBoard)){
      setDraw(true);
      return
    }

    setCurrentPlayer(currentPlayer==="X"?"O":"X");

  }
      
  function checkWin (newBoard){

    // check row win
    // 00 01 02
    // 10 11 12
    // 20 21 22 
    
    for(let i=0; i<length;i++){
      let flag=true;
      for(let j=0; j<length;j++){
        
        if(newBoard[i][0]==="" || newBoard[i][0]!==newBoard[i][j]){
          flag=false;
          break;
        };
      }
      if(flag){
        return true;
      };
    }
    // check col win  
    for(let i=0; i<length;i++){
      let flag=true;
      for(let j=0; j<length;j++){
        
        if(newBoard[0][i]==="" || newBoard[0][i]!==newBoard[j][i]){
          flag=false;
          break;
        }
      }
      if(flag){
        return true;
      };
    }
    // check left digonal 
    let LeftDiagonal=true;
    for(let i=0;i<length;i++){
      if(newBoard[0][0]==="" || newBoard[0][0]!==newBoard[i][i]){
        LeftDiagonal=false;
        break;
      } 
    }
    if(LeftDiagonal){
      return true;
    };

    // check right diagonal
    let RightDiagonal=true;
    for(let i=0;i<length;i++){
      if(newBoard[0][length-1]==="" || newBoard[0][length-1]!==newBoard[i][length-1-i]){
        RightDiagonal=false;
        break;
      };
    }
    if(RightDiagonal){
      return true;
    };

    return false;
  }
  // console.log(win);
  function checkDrawn (newBoard){
    for(let i=0;i<length;i++){
      for(let j=0;j<length;j++){
        
         if(newBoard[i][j]===""){
          return false;
         } 
        
      }
    }
    return true;
  }

  function handleReset (){
    generateBoard(length);
    setWin(false);
    setDraw(false);
    setCurrentPlayer("X")
  }

  return (
    <div>
      <input type='text' placeholder='please enter a number >= 3' onChange={(e)=>setLength(Number(e.target.value))}/>
      <button onClick={()=>generateBoard(length)}>Enter Number</button>
      <div>
        {
            board.map((row,rowInd)=>(
            <div  style={{display:"flex",justifyContent:"center",alignItems:"center",border:"1px solid black",height:"100px",width:`${100*length}px`}}>
              {
                board[rowInd].map((col,colInd)=>(
                  <div  onClick={()=>handleClick(rowInd,colInd)} style={{cursor:"pointer",border:"1px solid black",height:"100px",width:`${100*length}px`,textAlign:"center"}}>
                    <h1>{board[rowInd][colInd]}</h1>
                  </div>
                ))
              }
              
            </div>
          ))
        }

        {win && <h1>{currentPlayer} win</h1>} 
        {draw && <h1>Match drawn</h1>} 
        {(win || draw) && <button onClick={handleReset}>Reset</button>}
      </div>
    </div>
  );
}


export default App;