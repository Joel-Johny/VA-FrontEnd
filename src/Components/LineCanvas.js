import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function LineCanvas({ base64Image,formData }) {
  const canvasRef = useRef(null);
  console.log(base64Image);

  // For lines
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [lines, setLines] = useState([]);
  const [lineColors, setLineColors] = useState(["red", "green", "blue"]); // Define colors for lines

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

  const handleSubmit = () => {
    let roi_List = [];
    roi_List=lines.map((objectCoord, index) => {
      console.log(objectCoord)
      return{
        type: "line",
        name: `line${index + 1}`,
        start:[objectCoord.startPoint.x,objectCoord.startPoint.y],
        end:[objectCoord.endPoint.x,objectCoord.endPoint.y]
      }
      // coordinates[`line${index + 1}`] = objectCoord;
    });

    // const options = {
    //   weekday: "long",
    //   year: "numeric",
    //   month: "long",
    //   day: "numeric",
    //   hour: "numeric",
    //   minute: "numeric",
    //   second: "numeric",
    // };

    // const currentDateTime = new Date();
    // const formattedDate = currentDateTime.toLocaleDateString(
    //   undefined,
    //   options
    // );

    const json = {
      cameraid: formData.sourceId,
      analytics: formData.analytics,
      roi: roi_List
    };
    console.log(json)
    postData(json)
  };
  async function postData() {

    const url = "http://localhost:5000/ac/set_config";
    try {
      const response = await axios.post(url, formData);

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response

      // Handle the JSON response data here
      console.log("Response data:", responseData);
      toast(responseData.status_message,{position:"bottom-center"})
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
      toast.error(error,{position: "bottom-center"})
    }
  }
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
            `url("${base64Image}")`,
            // 'url("https://viso.ai/wp-content/uploads/2021/02/people-counting-computer-vision-background-1.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        }}
      ></canvas>
      <div className="canvas-info-container">
        <span>Please draw line in the Canvas</span>
        <div className="canvas-btn-container">
          <button onClick={handleErase}>Erase</button>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default LineCanvas;
