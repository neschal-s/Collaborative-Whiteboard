import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "./index.css";
import WhiteBoard from '../../components/whiteboard';
import { motion, AnimatePresence } from "framer-motion";
import Chat from '../../components/ChatBar';
import CollaborativeCodeEditor from '../../components/CollaborativeCodeEditor';
import { useEffect } from 'react';
import { toast } from 'react-toastify';


const RoomPage = ({ user, socket, users }) => {
  const { roomId } = useParams();

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [openedEditorTab, setOpenedEditorTab] = useState(false);
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedUserTab, setOpenedUserTab] = useState(false);
  const [openedChatTab, setOpenedChatTab] = useState(false);

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    setHistory((prevHistory) => [...prevHistory, elements[elements.length - 1]]);
    setElements((prevElements) => prevElements.slice(0, prevElements.length - 1));
  };

  const redo = () => {
    setElements((prevElements) => [...prevElements, history[history.length - 1]]);
    setHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  };

//  useEffect(() => {
//   if (!socket) return;

//   const handleUserJoined = ({ name, self,userId }) => {
//     if (self) {
//     toast.info("You joined the room");
//   } else {
//     toast.info(`${name} joined the room`);
//   }
//   };

//   const handleUserLeft = (name) => {
//     toast.info(`${name} left the room`);
//   };

//   // socket.on("userJoinedMessageBroadcast", handleUserJoined);
//   // socket.on("userLeftMessageBroadcast", handleUserLeft);

//   // return () => {
//   //   socket.off("userJoinedMessageBroadcast", handleUserJoined);
//   //   socket.off("userLeftMessageBroadcast", handleUserLeft);
//   };
// }, [socket]);




  return (
    <div className='row'>
      <button
        type="button"
        className='btn btn-dark'
        style={{
          display: "block",
          position: "absolute",
          top: "7%",
          left: "3%",
          height: "38px",
          width: "90px",
        }}
        onClick={() => setOpenedUserTab(true)}
      >
        Users
      </button>

      <button
        type="button"
        className='btn btn-primary'
        style={{
          display: "block",
          position: "absolute",
          top: "7%",
          left: "10%",
          height: "38px",
          width: "90px",
        }}
        onClick={() => setOpenedChatTab(true)}
      >
        Chats
      </button>
      <button
  type="button"
  className="btn btn-success"
  style={{
    display: "block",
    position: "absolute",
    top: "7%",
    left: "17%",
    height: "38px",
    width: "110px",
  }}
  onClick={() => setOpenedEditorTab(true)}
>
  Code Editor
</button>

      <div
        className="dynamic-text"
        style={{
          position: 'absolute',
          top: '15px',
          right: '-55px',
          fontWeight: '500',
          fontSize: '18px',
        }}
      >
        👥 Users Online: {users.length}
      </div>

      <AnimatePresence>
        {openedUserTab && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.4 }}
            className="position-fixed top-0 h-100 text-white bg-dark"
            style={{ width: "220px", left: 0, zIndex: 999 }}
          >
            <button
              type="button"
              onClick={() => setOpenedUserTab(false)}
              className="btn btn-light btn-block mt-5 mb-3 w-100"
            >
              Close
            </button>
            <div className="mt-3 pt-3">
              {users.map((usr,idx) => (
                <p key={usr.userId || idx} className="my-2 text-center w-100 mb-3">
                  {usr.name} {user?.userId === usr.userId && <strong>(You)</strong>}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {openedChatTab && (
          <Chat setOpenedChatTab={setOpenedChatTab} socket={socket} />
        )}
      </AnimatePresence>



      <AnimatePresence>
  {openedEditorTab && (
    <motion.div
      initial={{ x: -400 }}
      animate={{ x: 0}}
      exit={{ x: -600 }}
      transition={{ duration: 0.8 }}
      className="position-fixed top-0 h-100 bg-dark border rounded-4"
      style={{ width: "600px", left: 0, zIndex: 999, padding: '1rem' }}
    >
      <button
        type="button"
        className="btn btn-danger mb-3"
        onClick={() => setOpenedEditorTab(false)}
      >
        Close Editor
      </button>
      <CollaborativeCodeEditor socket={socket} roomId={roomId} user={user} />
    </motion.div>
  )}
</AnimatePresence>


      {user?.presenter && (
        <div className='d-flex flex-wrap justify-content-center align-items-center mb-5'>

          {/* Tool Selection */}
          <div className='d-flex gap-3 me-4'>
            {['Pencil', 'Line', 'Rectangle'].map((item) => {
              const value = item.toLowerCase();
              return (
                <div key={item} className='d-flex align-items-center gap-1'>
                  <input
                    type='radio'
                    name='tool'
                    id={item}
                    value={value}
                    checked={tool === value}
                    onChange={(e) => setTool(e.target.value)}
                    className='mt-1'
                  />
                  <label htmlFor={item} className='text-capitalize dynamic-text'>{item}</label>
                </div>
              );
            })}
          </div>

          {/* Color Picker */}
          <div className='d-flex align-items-center gap-2 me-5 ms-5'>
            <label htmlFor='color' className="dynamic-text">Select Color:</label>
            <input
              type='color'
              id='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className='form-control form-control-color mt-1 ms-2'
            />
          </div>

          {/* Undo / Redo Buttons */}
          <div className='d-flex gap-2 me-5'>
            <button
              className='btn btn-primary ms-5 border-0'
              disabled={elements.length === 0}
              onClick={() => undo()}
            >
              Undo
            </button>
            <button
              className='btn btn-outline-primary'
              disabled={history.length < 1}
              onClick={() => redo()}
            >
              Redo
            </button>
          </div>
          {/* Clear Button */}
          <div>
            <button className='btn btn-danger ms-5' onClick={handleClearCanvas}>Clear Canvas</button>
          </div>
        </div>
      )}

      <div className='col-md-12 mx-auto mt-1'>
        <WhiteBoard
          canvasRef={canvasRef}
          ctxRef={ctxRef}
          elements={elements}
          setElements={setElements}
          color={color}
          tool={tool}
          user={user}
          socket={socket}
        />
      </div>
    </div>
  );
};

export default RoomPage;
