import { useState, useEffect } from 'react'; // ✅
import { motion } from "framer-motion";
import { useRef } from 'react';

import "./index.css";


const Chat = ({ setOpenedChatTab,socket }) => {

  const [chat,setChat]=useState([]);
  const [message,setMessage]=useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(message.trim()!==""){
      setChat((prevChats)=>[...prevChats,{message, name:"You"}]);
      socket.emit("message",{message});
      setMessage("");
    }
  }

  useEffect(() => {
  socket.on("messageResponse", (data) => {
    setChat((prevChats) => [...prevChats, data]);
  });

  socket.on("typingResponse", (data) => {
    setTypingStatus(data);
    setTimeout(() => setTypingStatus(""), 1000);
  });

  // Optional: cleanup to avoid duplicate listeners if component re-renders
  return () => {
    socket.off("messageResponse");
    socket.off("typingResponse");
  };
}, []);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [chat]);



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
      <div className="mt-3 p-3 border border-1 border-white rounded-4" style={{
        height: "75%",
        maxHeight: "75%",
        overflowY: "auto",
        backgroundColor: "#1e1e1e",
      }}>
        {chat.map((msg, index) => (
          <div key={index} className={`d-flex ${msg.name === "You" ? "justify-content-end" : "justify-content-start"}`}>
            <div className={`px-3 py-2 mb-2 rounded-3 shadow-sm ${msg.name === "You" ? "bg-primary text-white" : "bg-light text-dark"}`}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{msg.name}</div>
              <div>{msg.message}</div>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      
      {typingStatus && (
  <p className="text-info text-center">
    {typingStatus}
    <span className="dot-typing"></span>
  </p>
)}

      </div>
      <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2 p-2 border-top border-secondary bg-dark">
  <input
    className="form-control bg-dark text-white border-secondary"
    placeholder="Type a message..."
    value={message}
    onChange={(e) => {
      setMessage(e.target.value);
      socket.emit("typing", { name: "You" });
    }}
  />
  <button className="btn btn-outline-light px-3" type="submit">
    Send
  </button>
</form>
    </motion.div>
  )
}

export default Chat