import React, { useRef, useState } from "react";

function LineCanvas() {
  const canvasRef = useRef(null);

  // For lines
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [lines, setLines] = useState([]);
  const [lineColors, setLineColors] = useState(["red","green","blue"]); // Define colors for lines

  const getNextLineColor = () => {
    // Get the next color in the list, and cycle back to the first if needed
    const nextColor = lineColors[lines.length % lineColors.length];
    return nextColor;
  };

  const handleMouseDown = (event) => {
    if (lines.length < 3) {
      if (!startPoint) {
        const { offsetX, offsetY } = event.nativeEvent;
        setStartPoint({ x: offsetX, y: offsetY });
      } else if (!endPoint) {
        const { offsetX, offsetY } = event.nativeEvent;
        setEndPoint({ x: offsetX, y: offsetY });
      }
    }
  };

  const previewLine = (event) => {

    if (lines.length < 3) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line, index) => {
        drawLine(line.startPoint, line.endPoint, lineColors[index]);
      });

      if (startPoint) {
        const first = startPoint;
        const { offsetX, offsetY } = event.nativeEvent;
        const second = { x: offsetX, y: offsetY };
        const nextColor = getNextLineColor();
        drawLine(first, second, nextColor);
      }
    }
  };

  const drawLine = (startPoint, endPoint, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  const handleErase = () => {
    setStartPoint(null);
    setEndPoint(null);
    setLines([]);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const draw = () => {

    if (startPoint && endPoint && lines.length < 3) {
      const newLine = { startPoint, endPoint };
      // without this also running how tf? need to research//
      const nextColor = getNextLineColor();
      drawLine(startPoint, endPoint, nextColor);
      // -----------------------------------------------// 
      setLines((oldList) => [...oldList, newLine]);
      setStartPoint(null);
      setEndPoint(null);
    }
  };

  const coords = () => {
    const coordinates = {};
    const canvas = canvasRef.current;
    lines.forEach((objectCoord, index) => {
      coordinates[`line${index + 1}`] = objectCoord;
    });

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString(undefined, options);

    const json = {
      imgHeight: canvas.height,
      imgWidth: canvas.width,
      timestamp: formattedDate,
      coords: coordinates,
    };

    const stringJson = JSON.stringify(json);
    console.log(json);
  };

  return (
    <div className="lineCanvas">
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
        onMouseDown={handleMouseDown}
        onMouseMove={previewLine}
        onMouseUp={draw}
        className="canvas"
        style={{
          backgroundImage:
            'url("https://viso.ai/wp-content/uploads/2021/02/people-counting-computer-vision-background-1.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: '100% 100%',
        }}
      ></canvas>
      <div className="canvas-info-container">
        <span>Please draw line in the Canvas</span>
        <div className="canvas-btn-container">
          <button onClick={handleErase}>Erase</button>
          <button onClick={coords}>Submit</button>
        </div>
      </div>


    </div>
  );
}

export default LineCanvas;
