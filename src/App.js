import { useEffect, useState } from 'react';
import io from "socket.io-client"
// https://tictactoebackend-4h20.onrender.com
const socket = io.connect("https://tictactoebackend-4h20.onrender.com");

function App() {
  const initialBoard = [['','',''],['','',''],['','','']]
  const [length, setLength]=useState(3);
  const [board, setBoard]=useState(initialBoard);
  const [currentPlayer, setCurrentPlayer]=useState("X");
  const [win, setWin]=useState(false);
  const [draw, setDraw]=useState(false);
  const [socetID, setSocketID]=useState(null);
  const [roomId, setRoomId] = useState(null);
  const [joinRoomFlag, setJoinRoomFlag] = useState(false);
  const [joinRoomId, setJoinRoomId] = useState(null);
  const [gameStartFlag, setGameStartFlag] = useState(false);
  const [error, setError] = useState(false);
  const [createdId, setCreatedId] = useState(false);

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
    socket.on("RoomID", (data)=>{
      setRoomId(data);
    })
    socket.on("GameStart", (data)=>{
      setGameStartFlag(data);
    })
    socket.on("CreatedId", (data)=>{
      setCreatedId(data);
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
      socket.emit("board",newBoard);
      setBoard(newBoard);
  
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
      socket.emit("winner", true);
      setWin(true);
      return;
    }
    
    if(checkDrawn(newBoard)){
      socket.emit("Drawn", true);
      setDraw(true);
      return
    }
    const nextPlayer = currentPlayer==="X"?"O":"X";
    
    socket.emit("currentPlayer", nextPlayer);
    setCurrentPlayer(nextPlayer);
    
    socket.emit("SocketID", socket.id);
    setSocketID(socket.id);

  }
      
  function checkWin (newBoard){

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
    socket.emit("winner", false);
    setWin(false);
    socket.emit("Drawn", false);
    setDraw(false);
    socket.emit("currentPlayer", 'X');
    setCurrentPlayer("X")
  }
  console.log(currentPlayer);
  function handleCreateRoom (){
    socket.emit("CreatedId",true);  
    setCreatedId(true);
    socket.emit("RoomID", socket.id);
    setRoomId(socket.id);
  }
  console.log(roomId);

  function handleJoinRoom (){
    
    if(roomId!==joinRoomId){
      setError(true);
      return;
    }
    setJoinRoomFlag(false);
    socket.emit("CreatedId",false);
    setCreatedId(false);
    socket.emit("GameStart", true);
    setGameStartFlag(true);
  }

  return (
    <div style={parentStyle}>
      <div style={subParentStyle}>
        <div style={InputParentStyle}>
            <input type='text' placeholder='please enter number >= 3' onChange={handleLength} style={inputStyle}/>
            <button onClick={()=>generateBoard(length)} style={buttonStyle}>Enter Number</button>
        </div>
      </div>
      <div>
        <div style={createParentRoomStyle}>
          <button style={createRoomButtonStyle} onClick={handleCreateRoom}>Create Room</button>
          <button style={createRoomButtonStyle} onClick={()=>setJoinRoomFlag(true)}>Join Room</button>
        </div>
      </div>
      {joinRoomFlag && 
         <div style={subParentStyle}>
          <div style={InputParentStyle}>
              <input type='text' placeholder='please enter room id' onChange={(e)=>setJoinRoomId(e.target.value)} style={inputStyle}/>
              <button style={buttonStyle} onClick={handleJoinRoom}>Enter Id</button>
          </div>
       </div>
      }

      {(createdId && socket.id===roomId) && <h2 style={{textAlign:"center"}}>{roomId}</h2>} 

      {gameStartFlag && 
        <div style={boxParentStyle}>
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
      }
      {
        error && <h2 style={{textAlign:"center"}}>Please enter valid id</h2>
      }
    </div>
  );
}

const parentStyle = {
  backgroundColor: '#f0f0f0',
  height: '100vh'
}

const subParentStyle = { 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
}

const createParentRoomStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '10px'
}

const createRoomButtonStyle={
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  order: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  marginLeft: '5px'
}

const boxParentStyle={ 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center', 
  height: '60vh' 
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


