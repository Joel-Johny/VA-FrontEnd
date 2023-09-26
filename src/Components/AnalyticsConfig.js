
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LineCanvas from "./LineCanvas";
import RegionCanvas from "./RegionCanvas";
import axios from "axios";
import socketIOClient from 'socket.io-client';

function AnalyticsConfig() {

  useEffect(() => {
    getConfig()
    const ENDPOINT = 'http://localhost:5000'; // Replace with your Flask server's URL
    const socket = socketIOClient(ENDPOINT);
  
    socket.on('connect', () => {
      console.log('Connected to the server via WebSocket');
    });
    socket.on('kafka_msg_data', (data) => {
      // Convert the received BSON encoded data to a JavaScript object
      console.log(data);
      setImageData(data.base64_url)
  
    });
  }, [])

  const [formData, setFormData] = useState({
    sourceId: "",
    analytics: ""
  });
  const [imageData, setImageData] = useState(null)
  const [sourceOptions, setSourceOptions] = useState(null)

  

  const handleChangeSource = (e) => {
    // const { name, value } = e.target;
    const name = e.target.name;
    const value= e.target.value;
    console.log(name, value)
    console.log(formData)

    setFormN

    s({
      ...formData,
      [name]: value,
    });
  };



  const handleChangeAnalytics = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("Calling getImage Image making a get request....")
    getImage()
  };

  async function getImage() {
    const url = "http://localhost:5000/custom"; // ORG : http://localhost:5000/get_image
    try {
      const response = await axios.get(url);
      const base64Image = response.data.base64_url
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }

  async function getConfig() {
    const url = "http://localhost:5000/get_config";
    try {
      const response = await axios.get(url);

      const responseData = response.data; // Axios already parses the JSON response
      const jsonString = JSON.parse(responseData.status_message)
      const get_list=jsonString.map((object)=>{
        // return `SourceId : ${object.source_id} , Name : ${object.source_name}`
        // return {"SourceId":object.source_id, "Name":object.source_name}
        return object.source_id
      })
      // console.log(get_list)
      console.log(formData.sourceId);
      setFormData({
        ...formData,
        sourceId: get_list,
      });
      console.log(formData.sourceId);
      // Handle the JSON response data here
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
  };

  return (
    
    <div className="analytics">
      <div className="analytics_form_container ">
        <h2>Analytics Configuration</h2>
        <form onSubmit={handleSubmit} className="analytics_form">
          <div className="label_input_container">
            <label>Source Id:</label>
            <select
              onChange={handleChangeSource}
              value={formData.sourceId}
              name="sourceId"
            >
              <option value="null" hidden>
                Select Source ID
              </option>
              {formData.sourceId && formData.sourceId.map((sourceId, index) => (
                <option key={index} value={sourceId}>
                  {sourceId}
                </option>
              ))}
            </select>
            {/* <select
                onChange={handleChangeSource}
                value={formData.sourceId}
                name="sourceId"
              >
                <option value="null" hidden>
                  Select Source ID
                </option>
                <option value="0">0 </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select> */}
          </div>

          <div className="label_input_container">
            <label>Analytics : </label>
            <select
              onChange={handleChangeAnalytics}
              value={formData.analytics}
              name="analytics"
            >
              <option value="null" hidden>
                Select Mode
              </option>
              <option value="Loitering">Loitering </option>
              <option value="Line Crossing">Line Crossing</option>
              <option value="Crowd">Crowd</option>
            </select>
          </div>

        </form>
      </div>

      <div class="canvas_container">
        {/* <img src={`data:image/jpeg;base64,${imageData}`}/> */}
        {formData.analytics === "Line Crossing"
          ? <LineCanvas base64Image={imageData} formData={formData} /> : (formData.analytics === "Crowd" ? <RegionCanvas base64Image={imageData} formData={formData} /> : (formData.analytics === "Loitering" ? <LineCanvas base64Image={imageData} formData={formData} /> : null))}
      </div>
    </div>
  );
}

export default AnalyticsConfig;
