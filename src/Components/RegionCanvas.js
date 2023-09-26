import React, { useRef, useState } from "react";

function RegionCanvas() {
  const canvasRef = useRef(null);
  const [rcoord, setRcoord] = useState([]);
  const [regions, setRegions] = useState([]);
  const [regionColors, setRegionColors] = useState(["rgba(255,0,0,0.3)", "rgba(0,255,0,0.3)", "rgba(0,0,255,0.3)"]); // Define colors for lines

  const handleMouseDown = (event) => {
    if(regions.length<3){
      const { offsetX, offsetY } = event.nativeEvent;
      if (rcoord.length < 4) {
        setRcoord([...rcoord, { x: offsetX, y: offsetY }]);
      }
    }
    
  };
  const getNextLineColor = () => {
    // Get the next color in the list, and cycle back to the first if needed
    const nextColor = regionColors[regions.length];
    return nextColor;
  };

  const drawRegion = (objectCoord, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    console.log(color)
    ctx.beginPath();
    ctx.moveTo(objectCoord[0].x, objectCoord[0].y); 
    ctx.lineTo(objectCoord[1].x, objectCoord[1].y);
    ctx.lineTo(objectCoord[2].x, objectCoord[2].y); 
    ctx.lineTo(objectCoord[3].x, objectCoord[3].y); 
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = color.replace(/,\s*[\d.]+\)/, ", 1)");;
    ctx.lineWidth = 1;
    ctx.stroke();
    
  }
  const drawLine = (startPoint, endPoint, color) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.strokeStyle = color.replace(/,\s*[\d.]+\)/, ", 1)");
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  const previewLine = (event) => {
    if(regions.length<3){

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    //draw old regions after clearing screen from stored vertex

      if(regions.length>0){
        regions.forEach((objectCoord,index)=>{
          drawRegion(objectCoord,regionColors[index])
        })
      }
     
      if (rcoord.length > 0) {
        /* The below execution is for connecting 2 vertex after clicking on second vertex */
        if (rcoord.length > 1) {
          for (let i = 0; i < rcoord.length - 1; i++) {
            const first = rcoord[i];
            const second = rcoord[i + 1];
            const nextColor = getNextLineColor();
            drawLine(first, second, nextColor);          }
        }

        /*The below code is for preview line execution from last saved vertex for cursor movement */
        const first = rcoord[rcoord.length - 1];
        const { offsetX, offsetY } = event.nativeEvent;
        const second = { x: offsetX, y: offsetY };
        const nextColor = getNextLineColor();
        drawLine(first, second, nextColor);

      }

    }
      
    
  };


  const handleErase = () => {
    setRcoord([]);
    setRegions([])
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const draw = () => {
      if (rcoord.length === 4) {
        const nextColor = getNextLineColor();
        drawRegion(rcoord, nextColor);
        setRegions((oldRegions)=>[...oldRegions,rcoord])
        setRcoord([])
      }
  };

  const coords = () => {
    const canvas = canvasRef.current;
    let coordinates={}; // Declare a variable to store the coordinates
    regions.forEach((objectCoord,index)=>{
      coordinates[`region`+(index+1)]=objectCoord

    })
   

    /* preparing time stamp string */
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const currentDateTime = new Date();
    const formattedDate = currentDateTime.toLocaleDateString(undefined, options);

    const json = {
      imgHeight: canvas.height,
      imgWidth: canvas.width,
      timestamp: formattedDate,
      coords: coordinates // Use the variable "coordinates" here
    };

    const stringJson = JSON.stringify(json);
    console.log(json);
  };

  return (
    <div className="regionCanvas">
      <canvas
        ref={canvasRef}
        width={640} // Set the canvas width to match your image dimensions
        height={640} // Set the canvas height to match your image dimensions
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
      />

    <div className="canvas-info-container">
        <span>Please draw region in the Canvas</span>
        <div className="canvas-btn-container">
          <button onClick={handleErase}>Erase</button>
          <button onClick={coords}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default RegionCanvas;
