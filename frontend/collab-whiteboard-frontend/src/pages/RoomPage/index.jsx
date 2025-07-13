import { useState } from 'react';
import "./index.css";
import WhiteBoard from '../../components/whiteboard';
import { useRef } from 'react';

const RoomPage = () => {

  const canvasRef=useRef(null);
  const ctxRef=useRef(null);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000"); 
  const [elements,setElements]=useState([]);
  const [history,setHistory]=useState([]);
  

  const handleClearCanvas=()=>{
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    ctx.fillRect="white";
    ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
    setElements([]);

  }

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
    <div className='container'>
      <h1 className='text-center py-4'>
        White Board Sharing App 
        <span className='text-secondary text-s'> [Users Online: 0]</span>
      </h1>

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

      <div className='col-md-10 mx-auto mt-4 canvas-box'>
        <WhiteBoard 
          canvasRef={canvasRef} 
          ctxRef={ctxRef}
         elements={elements}
         setElements={setElements}
         color={color}
         tool={tool}
         />
      </div>
    </div>
  );
};

export default RoomPage;
