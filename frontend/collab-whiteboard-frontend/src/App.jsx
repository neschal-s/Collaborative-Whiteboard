import './App.css'
import Forms from './components/Forms/'
import {Route, Routes} from 'react-router-dom'
import RoomPage from './pages/RoomPage'
import io from "socket.io-client";
import {toast, ToastContainer} from 'react-toastify';


const server="http://localhost:5000";
const connectionOptions={
  "force new connection":true,
  reconnectionAttempts:"Infinity",
  timeout:10000,
  transports:["websocket"],
}

const socket=io(server,connectionOptions);
import { use, useEffect, useState } from 'react'




const App=()=> {

  const [user,setUser]=useState(null);
  const [users,setUsers]=useState([]);




  // useEffect(()=>{
  //   socket.on("userIsJoined",(data)=>{
  //     if(data.success){
  //       console.log("userJoined");
  //       setUser(users.data);
  //     }
  //     else{
  //       console.log("userNotJoined");
  //     }
  //   });

  //   socket.on("allusers",(data)=>{
  //      setUsers(data);
  //   })
  // },[])

  useEffect(() => {
  socket.on("userIsJoined", (data) => {
    if (data.success) {
      console.log("userJoined");
      setUser(data.user); // ✅ CORRECT
      setUsers(data.users); // ✅ update users list too
    } else {
      console.log("userNotJoined");
    }
  });

  socket.on("allUsers", (data) => {
    setUsers(data);
  });

  socket.on("userJoinedMessageBroadcast",(data)=>{
    toast.info(`${data} joined the room`)
    
  });
  

  socket.on("userLeftMessageBroadcast", (data) => {
  toast.info(`${data} left the room`);
});


  return () => {
    socket.off("userIsJoined");
    socket.off("allUsers");
  };


}, []);





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
        <ToastContainer/>
        <Routes>
          <Route path="/" element={<Forms uuid={uuid} socket={socket} setUser={setUser}/> }/>

          <Route path="/:roomId" element={<RoomPage user={user} socket={socket} users={users}/>} />
        </Routes> 
      </div>
    </>
  )
}

export default App
