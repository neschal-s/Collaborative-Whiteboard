import { use, useState,useEffect } from 'react';
import "./index.css";
import WhiteBoard from '../../components/whiteboard';
import { useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";


const RoomPage = ({user,socket,users}) => {

  const canvasRef=useRef(null);
  const ctxRef=useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000"); 
  const [elements,setElements]=useState([]);
  const [history,setHistory]=useState([]);
  const [openedUserTab,setOpenedUserTab]=useState(false);  

  

  const handleClearCanvas = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  setElements([]);
};


  const undo=()=>{
    setHistory((prevHistory)=>[...prevHistory,elements[elements.length -1]]);
    setElements(
      (prevElements)=>prevElements.slice(0,prevElements.length -1)
    );
  }

  const redo=()=>{
    setElements((prevElements)=>[...prevElements,history[history.length -1]]);
    setHistory((prevHistory)=>prevHistory.slice(0,prevHistory.length -1));
  }



  return (
    <div className='row'>
      <button type="button" className='btn btn-dark'
        style={{
          display:"block",
          position:"absolute",
          top:"5%",
          left:"5%",
          height:"40px",
          width:"100px",
        }}
        onClick={()=>setOpenedUserTab(true)}
      >Users</button>
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
        {users.map((usr) => (
          <p key={usr.userId} className="my-2 text-center w-100 mb-3">
            {usr.name} {user?.userId === usr.userId && <strong>(You)</strong>}
          </p>
        ))}
      </div>
    </motion.div>
  )}
</AnimatePresence>


      <h1 className='text-center py-4'>
        White Board Sharing App{" "}
        <span className='text-primary'> [Users Online: {users.length}]</span>
      </h1>
      {
        user?.presenter && (
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
      <label htmlFor={item} className='text-capitalize'>{item}</label>
    </div>
  );
})}

        </div>

        {/* Color Picker */}
        <div className='d-flex align-items-center gap-2 me-5 ms-5'>
          <label htmlFor='color'>Select Color:</label>
          <input
            type='color'
            id='color'
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className='form-control form-control-color border- mt-1 ms-3'
          />
        </div>

        {/* Undo / Redo Buttons */}
        <div className='d-flex gap-2 me-5'>
          <button className='btn btn-primary ms-5'
            disabled={elements.length==0}
            onClick={()=>undo()}          
          
          >        
          Undo</button>
          <button className='btn btn-outline-primary'
            disabled={history.length<1}      
            onClick={()=>redo()}
                    
          >Redo</button>
        </div>

        {/* Clear Button */}
        <div>
          <button className='btn btn-danger ms-5 ' onClick={handleClearCanvas}>Clear Canvas</button>
        </div>
      </div>
        )
      }

      

      <div className='col-md-10 mx-auto mt-4 canvas-box'>
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
