import React, { useEffect, useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const roughGenerator = rough.generator();

// Helper: draw rounded rect on canvas context manually
const drawRoundedRect = (ctx, x, y, width, height, radius, strokeStyle) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = 2;
  ctx.stroke();
};

const WhiteBoard = ({ canvasRef, ctxRef, elements, setElements, color, tool, user, socket }) => {
  const [img, setImg] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Receive whiteboard image from others
  useEffect(() => {
    const handler = (data) => setImg(data.imgURL);
    socket.on("WhiteBoardDataResponse", handler);
    return () => {
      socket.off("WhiteBoardDataResponse", handler);
    };
  }, [socket]);

  // If not presenter, just show image
  if (!user?.presenter) {
    return (
      <div className="border border-dark border-2 h-100 w-100 overflow-hidden">
        <img
          src={img}
          alt="Real time white board shared by presenter"
          style={{
            height: "100vh",
            width: "100vw",
            objectFit: "contain",
            textAlign: "center",
            display: "flex",
          }}
        />
      </div>
    );
  }

  // Resize canvas on mount and window resize
  useEffect(() => {
    const canvas = canvasRef.current;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineWidth = 1;
      ctx.strokeStyle = color;
      ctxRef.current = ctx;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, [color]);

  // Update stroke style when color changes
  // useEffect(() => {
  //   if (ctxRef.current) {
  //     ctxRef.current.strokeStyle = color;
  //   }
  // }, [color]);

  useEffect(() => {
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  ctx.lineCap = "round";
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;

  ctxRef.current = ctx;
}, [color]);


  // Helper to get mouse position relative to canvas
  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  };

  // Redraw canvas on elements change
  // useLayoutEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = ctxRef.current;
  //   const roughCanvas = rough.canvas(canvas);

  //   // Clear canvas fully
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   elements.forEach((element) => {
  //     if (element.type === "rectangle") {
  //       const x = element.width < 0 ? element.offsetX + element.width : element.offsetX;
  //       const y = element.height < 0 ? element.offsetY + element.height : element.offsetY;
  //       const width = Math.abs(element.width);
  //       const height = Math.abs(element.height);

  //       // Draw rounded rectangle manually
  //       drawRoundedRect(ctx, x, y, width, height, 10, element.stroke);
  //     } else if (element.type === "pencil") {
  //       roughCanvas.linearPath(element.path, {
  //         stroke: element.stroke,
  //         strokeWidth: 1,
  //         roughness: 0,
  //       });
  //     } else if (element.type === "line") {
  //       roughCanvas.line(
  //         element.offsetX,
  //         element.offsetY,
  //         element.width,
  //         element.height,
  //         {
  //           stroke: element.stroke,
  //           strokeWidth: 2,
  //           roughness: 0,
  //         }
  //       );
  //     }
  //   });

  //   // Send updated canvas image to others
  //   const canvasImage = canvas.toDataURL();
  //   socket.emit("WhiteBoardData", canvasImage);
  // }, [elements, socket]);



  useLayoutEffect(() => {
  if (!canvasRef.current) return;          // check canvas exists
  const canvas = canvasRef.current;

  const ctx = ctxRef.current;
  if (!ctx) return;                        // check context exists

  const roughCanvas = rough.canvas(canvas);

  // Clear canvas fully
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  elements.forEach((element) => {
    if (element.type === "rectangle") {
      const x = element.width < 0 ? element.offsetX + element.width : element.offsetX;
      const y = element.height < 0 ? element.offsetY + element.height : element.offsetY;
      const width = Math.abs(element.width);
      const height = Math.abs(element.height);

      // drawRoundedRect is your helper to draw rounded rectangles with canvas API
      drawRoundedRect(ctx, x, y, width, height, 10, element.stroke);
    } else if (element.type === "pencil") {
      roughCanvas.linearPath(element.path, {
        stroke: element.stroke,
        strokeWidth: 1,
        roughness: 0,
      });
    } else if (element.type === "line") {
      roughCanvas.line(
        element.offsetX,
        element.offsetY,
        element.width,
        element.height,
        {
          stroke: element.stroke,
          strokeWidth: 2,
          roughness: 0,
        }
      );
    }
  });

  // Send updated canvas image to others
  const canvasImage = canvas.toDataURL();
  socket.emit("WhiteBoardData", canvasImage);
}, [elements, socket]);


  // Mouse handlers for drawing
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = getMousePos(e);

    if (tool === "pencil") {
      setElements((prev) => [
        ...prev,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tool === "line") {
      setElements((prev) => [
        ...prev,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tool === "rectangle") {
      setElements((prev) => [
        ...prev,
        {
          type: "rectangle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }

    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getMousePos(e);

    if (tool === "pencil") {
      const { path } = elements[elements.length - 1];
      const newPath = [...path, [offsetX, offsetY]];
      setElements((prev) =>
        prev.map((ele, i) =>
          i === elements.length - 1 ? { ...ele, path: newPath } : ele
        )
      );
    } else if (tool === "line") {
      setElements((prev) =>
        prev.map((ele, i) =>
          i === elements.length - 1
            ? { ...ele, width: offsetX, height: offsetY }
            : ele
        )
      );
    } else if (tool === "rectangle") {
      setElements((prev) =>
        prev.map((ele, i) =>
          i === elements.length - 1
            ? {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              }
            : ele
        )
      );
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
      style={{ touchAction: "none" }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WhiteBoard;
