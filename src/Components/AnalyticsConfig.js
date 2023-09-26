import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LineCanvas from "./LineCanvas";
import RegionCanvas from "./RegionCanvas";
import axios from "axios";

function AnalyticsConfig() {

  useEffect(()=>{
    getConfig()
  },[])


  const [formData, setFormData] = useState({
    sourceId:"",
    analytics:""
  });
  const [imageData,setImageData]=useState(null)

  const handleChangeSource = (e) => {
    const { name, value } = e.target;
    setFormData({
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

  async function getImage(){
    const url = "http://localhost:5000/get_image";
    try {
      const response = await axios.get(url);
      const base64Image = response.data.image_data;
      setImageData(base64Image)
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }

  async function getConfig(){
    const url = "http://localhost:5000/ac/get_config";
    try {
      const response = await axios.get(url);

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response
      setFormData({
        ...formData,
        analytics: responseData.analytics,
        sourceId: responseData.source_id,
      });
      // Handle the JSON response data here
      console.log("Response data:", responseData);
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
                <option value="0">0 </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
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
        {formData.analytics==="Line Crossing"
         ? <LineCanvas base64Image={imageData} formData={formData}/>:(formData.analytics==="Crowd"?<RegionCanvas base64Image={imageData} formData={formData}/>:(formData.analytics==="Loitering"?<RegionCanvas base64Image={imageData} formData={formData}/>:null))}
      </div>
    </div>
  );
}

export default AnalyticsConfig;
