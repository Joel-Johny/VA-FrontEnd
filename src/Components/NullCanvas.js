import React, { useRef, useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uid } from "uuid";

function NullCanvas({ base64Image,formData}) {
  const canvasRef = useRef(null);
 
  return (
    <div className="NullCanvas">
      <canvas
        ref={canvasRef}
        width={640}
        height={640}
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
        <span>ROI configuration is not required for this analytics</span>
        <div className="canvas-btn-container">
        </div>
      </div>
    </div>
  );
}

export default NullCanvas;
