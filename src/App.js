import { useEffect, useState } from 'react';
import io from "socket.io-client"

const socket = io.connect("http://localhost:8000");

function App() {
  const initialBoard = [['','',''],['','',''],['','','']]
  const [length, setLength]=useState(3);
  const [board, setBoard]=useState(initialBoard);
  const [currentPlayer, setCurrentPlayer]=useState("X");
  const [win, setWin]=useState(false);
  const [draw, setDraw]=useState(false);
  const [socetID, setSocketID]=useState(null);

  useEffect(()=>{
    socket.on('board', (data)=>{
      setBoard(data);
    })
    socket.on("currentPlayer", (data)=>{
      setCurrentPlayer(data);
    })
    socket.on("length", (data)=>{
      setLength(data);
    })
    socket.on("winner", (data)=>{
      setWin(data);
    })
    socket.on("Drawn", (data)=>{
      setDraw(data);
    })
    socket.on("SocketID", (data)=>{
      setSocketID(data);
    })
  },[socket])

  function handleLength (e){
    socket.emit("length", Number(e.target.value));
    setLength(Number(e.target.value));
  }
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
    if(socetID===socket.id) return; 
    if(win) return; 
    if(board[RowIndx][ColIndx]!=="") return;
    let newBoard = board.map((Row)=>[...Row]);
    newBoard[RowIndx][ColIndx]=currentPlayer;

    socket.emit("board",newBoard)
    setBoard(newBoard);
    
    if(checkWin(newBoard)){
      setWin(true);
      socket.emit("winner", true);
      return;
    }
    
    if(checkDrawn(newBoard)){
      setDraw(true);
      socket.emit("Drawn", true);
      return
    }
    const nextPlayer = currentPlayer==="X"?"O":"X";
    
    setCurrentPlayer(nextPlayer);
    socket.emit("currentPlayer", nextPlayer);
    
    socket.emit("SocketID", socket.id);
    setSocketID(socket.id);

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
  console.log(currentPlayer);
  return (
    <div style={parentStyle}>
      <div style={subParentStyle}>
        <div style={InputParentStyle}>
            <input type='text' placeholder='please enter a number >= 3' onChange={handleLength} style={inputStyle}/>
            <button onClick={()=>generateBoard(length)} style={buttonStyle}>Enter Number</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
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

const parentStyle = {
  backgroundColor: '#f0f0f0',
}

const subParentStyle = { 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

const InputParentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  border: '1px solid #ccc',
}

const inputStyle = {
  cursor: 'pointer',
  padding: '10px 20px',
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  order: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginLeft: '5px'
}

export default App;

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
