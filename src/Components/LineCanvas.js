import React, { useRef, useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uid } from "uuid";

function LineCanvas({ base64Image,formData,lineDetails,setLineDetails}) {
  const canvasRef = useRef(null);

  // For lines
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [lineColors, setLineColors] = useState(["red", "green", "blue"]); // Define colors for lines

  useEffect(()=>{
    //Calling preConfiguredDrawings Function after the comp loads so that prev configured drawings are drawn in cavas
    //with UseEffect having dependancy of analytics form data this means whenever component loads or form value changes preconfig will be drawn 
    preConfiguredDrawings()
  },[formData.analytics])
  const getNextLineColor = () => {
    // Get the next color in the list, and cycle back to the first if needed
    const nextColor = lineColors[lineDetails.length % lineColors.length];
    return nextColor;
  };

  const preConfiguredDrawings=()=>{
    if (lineDetails.length < 3) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lineDetails.forEach((line, index) => {
        drawLine({x:line.start[0],y:line.start[1]}, {x:line.end[0],y:line.end[1]}, lineColors[index]);
      });}
  }
  const handleMouseDown = (event) => {
    if (lineDetails.length < 3) {
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
    if (lineDetails.length < 3) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lineDetails.forEach((line, index) => {
        drawLine({x:line.start[0],y:line.start[1]}, {x:line.end[0],y:line.end[1]}, lineColors[index]);
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
    setLineDetails([])
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const draw = () => {
    if (startPoint && endPoint && lineDetails.length < 3) {
      const newLine = { name:`Line ${lineDetails.length+1}`,id:uid(),start:[startPoint.x,startPoint.y], end:[endPoint.x,endPoint.y] ,type:"line"};
      // without this also running how tf? need to research//
      const nextColor = getNextLineColor();
      drawLine(startPoint, endPoint, nextColor);
      // -----------------------------------------------//
      // setLines((oldList) => [...oldList, newLine]);
      setStartPoint(null);
      setEndPoint(null);
      setLineDetails((oldLine)=>{
        return [...oldLine,newLine]
      })
    }
  };

  const handleSubmit = () => {
    let roi_List = [];
    roi_List=lineDetails.map((line,index) => {
      return{
        type : line.type,
        name : line.name.trim() ||  `Line ${index+1}`,
        start : line.start,
        end :line.end
      }
    });

    const json = {
      cameraid: formData.sourceId.split(',')[0].split(':')[1].trim(),
      analytics: formData.analytics,
      roi: roi_List
    };
    console.log(json)
    postData(json)
  };
  async function postData(json) {

    const url = "http://localhost:5000/ac/set_config";
    try {
      const response = await axios.post(url, json);

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response

      // Handle the JSON response data here
      console.log("Response data:", responseData);
      toast("Analytics Configured Successfully",{position:"bottom-center"})
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
