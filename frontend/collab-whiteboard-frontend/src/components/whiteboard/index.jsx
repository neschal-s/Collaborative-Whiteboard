import React, { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, color, tool,user,socket }) => {

  const [img,setImg]=useState(null);
  useEffect(()=>{
    socket.on("WhiteBoardDataResponse",(data)=>{
      setImg(data.imgURL);
    });
  },[]);


  if(!user?.presenter)
  {
    return (
      <div className="border border-dark border-2 h-100 w-100 overflow-hidden">
        <img src={img} alt="Real time white board image shared by presenter" 
          style={{
            height:window.innerHeight * 2,
            width:"285%",
          }}
          />
      </div>
    );
  }


  const [isDrawing, setIsDrawing] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle=color;
    ctx.lineWidth=1;
    ctx.lineCap="round"; 
    ctxRef.current = ctx;
  }, []);

  useEffect(()=>{

  })


  useEffect(()=>{
    ctxRef.current.strokeStyle=color;
  },[color]);


  useLayoutEffect(() => {
    if(canvasRef){
      const canvas = canvasRef.current;
      const roughCanvas = rough.canvas(canvas);

      if (elements.length > 0) {
        ctxRef.current.clearRect(
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      elements.forEach((element) => {
        if (element.type === "rect") {
          const x = element.width < 0 ? element.offsetX + element.width : element.offsetX;
          const y = element.height < 0 ? element.offsetY + element.height : element.offsetY;
          const width = Math.abs(element.width);
          const height = Math.abs(element.height);

          roughCanvas.draw(
            roughGenerator.rectangle(x, y, width, height,
              {stroke:element.stroke,
                strokeWidth:2,
                roughness:0
              }
            )
          );
        }
        else if (element.type === "pencil") {
          roughCanvas.linearPath(element.path,
            {stroke:element.stroke,
                strokeWidth:1,
                roughness:0
              }
          );
        } 
        else if (element.type === "line") {
          roughCanvas.line(
            element.offsetX,
            element.offsetY,
            element.width,
            element.height,
            {stroke:element.stroke,
                strokeWidth:2,
                roughness:0
              }
          );
        }
    });

    const canvasImage=canvasRef.current.toDataURL(  )
    socket.emit("WhiteBoardData",canvasImage);
  }
  }, [elements]);


  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } 
    else if (tool === "line") {
      setElements((prevElements) => [
        ...prevElements,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    }

    else if (tool === "rect") {
      setElements((prev) => [
        ...prev,
        {
          type: "rect",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]
    )
  }    

    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (isDrawing) {
      if (tool === "pencil") {
        const { path } = elements[elements.length - 1];
        const newPath = [...path, [offsetX, offsetY]];
        setElements((prevElements) =>
          prevElements.map((ele, index) =>
            index === elements.length - 1 ? { ...ele, path: newPath } : ele
          )
        );
      } else if (tool === "line") {
        setElements((prevElements) =>
          prevElements.map((ele, index) =>
            index === elements.length - 1
              ? { ...ele, width: offsetX, height: offsetY }
              : ele
          )
        );
      }
      else if(tool=="rect")
      {
        setElements((prevElements)=>
          prevElements.map((ele,index)=>{
            if(index==elements.length-1)
            {
              return {
                ...ele,
                width:offsetX- ele.offsetX,
                height:offsetY - ele.offsetY,
              };
            } 
            else {
                return ele;
              }
            })  
      );
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  



  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border border-dark border-2 h-100 w-100 overflow-hidden"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard;