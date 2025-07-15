import { useState, useEffect } from 'react'; // ✅
import { motion } from "framer-motion";

import "./index.css";


const Chat = ({ setOpenedChatTab }) => {

  const [chat,setChat]=useState([]);
  const message=useState("");

  const handleSubmit=(e)=>{
    e.preventDefault();
  }
  



  return (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0 }}
      exit={{ x: -400 }}
      transition={{ duration: 0.6 }}
      className="position-fixed top-0 h-100 text-white bg-dark"
      style={{ width: "400px", left: 0, zIndex: 999 }}
    >
      <button
        type="button"
        onClick={() => setOpenedChatTab(false)}
        className="btn btn-light btn-block mt-5 mb-3 w-100"
      >
        Close
      </button>
      <div className="mt-3 p-3 border border-1 border-white rounded-4" style={{height:"75%"}}>
        Chats
      </div>
      <form onSubmit={handleSubmit} className="mt-3 d-flex border border-1 border-white rounded-3">
        <input className='border-0 p-2 w-100 text-white rounded-3' placeholder='Enter Message' type='text' style={{"backgroundColor":"transparent"}}
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        >
        </input>
        <button className='m-1 mx-1 rounded-3 border-0 px-2' type='submit' style={{"backgroundColor":"lightblue"}}>Send</button>

      </form>
    </motion.div>
  )
}

export default Chat