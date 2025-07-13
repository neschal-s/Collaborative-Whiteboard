import './App.css'
import Forms from './components/Forms/'
import {Route, Routes} from 'react-router-dom'
import RoomPage from './pages/RoomPage'
import io from "socket.io-client";


const server="http://localhost:5173";
const connectionOptions={
  "force new connection":true,
  reconnectionAttempts:"Infinity",
  timeout:10000,
  transports:["websocket"],
}

const socket=io(server,connectionOptions);
import { useEffect, useState } from 'react'




const App=()=> {

  const [user,setUser]=useState(null);



  useEffect(()=>{
    socket.on("userIsJoined",(data)=>{
      if(data.success){
        console.log("userJoined");
      }
      else{
        console.log("userNotJoined");
      }
    });
  },[])

  const uuid=()=>{
    let S4=()=>{
      return (((1 +Math.random())* 0x10000) | 0 ).toString(16).substring(1);
    };
    return (
      S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()
    );
  }

  return (
    <>
      <div className='conatainer'>
        <Routes>
          <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/> }/>

          <Route path="/:roomId" element={<RoomPage/>} />
        </Routes> 
      </div>
    </>
  )
}

export default App
