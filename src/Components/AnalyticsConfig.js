import React, { useEffect, useState, useRef } from "react";
import LineCanvas from "./LineCanvas";
import RegionCanvas from "./RegionCanvas";
import axios from "axios";
import socketIOClient from "socket.io-client";
import { toast } from "react-toastify";
import { v4 as uid } from "uuid";

function AnalyticsConfig() {
  const ENDPOINT = "http://localhost:5000"; // Replace with your Flask server's URL
  const socketRef = useRef(null); // Ref for socket
  const [formData, setFormData] = useState({
    sourceId: "",
    analytics: "",
  });
  const [imageData, setImageData] = useState(null);
  const [sourceOptions, setSourceOptions] = useState(null);
  const [lineDetails, setLineDetails] = useState([]);
  const [regionDetails, setRegionDetails] = useState([]);
  const staticObject = [
    // {
    //   type: "line",
    //   name: "entry_line",
    //   start: [0, 0],
    //   end: [500, 400],
    // },
    // {
    //   type: "line",
    //   name: "exit_line",
    //   start: [10, 10],
    //   end: [204, 203],
    // },
  ];
  useEffect(() => {
    getConfig();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const handleChangeSource = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const setRoiDetails = (staticObject) => {
    const formatedLineDetails = staticObject.map((lineData) => {
      return { ...lineData, id: uid() };
    });
    console.log("THis is the line details sent to canvas",formatedLineDetails);
    setLineDetails(formatedLineDetails);
  };

  const handleChangeAnalytics = (e) => {
    const { name, value } = e.target;
    console.log(name,value)
    setFormData({
      ...formData,
      [name]: value,
    });
    setLineDetails([]);
    setRegionDetails([]);

    console.log("Calling getImage making a get request....");
    getImage();
    setRoiDetails(staticObject);
  };

  async function getImage() {
    const url = "http://localhost:5000/ac/get_image"; // ORG : http://localhost:5000/ac/get_image
    const data_to_send = {
      "sourceId": formData.sourceId.split(',')[0].split(':')[1].trim(),
      "analytics": formData.analytics
    }
    try {
      const response = await axios.post(url, data_to_send);
      setImageData(response.data.status_message.base64_url);
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
      const jsonString = JSON.parse(responseData.status_message);

      const get_list = jsonString.map((object) => {
        return `SourceId : ${object.source_id} , Name : ${object.source_name}`
        // return object.source_id;
      });
      // console.log(get_list)

      setSourceOptions(get_list);
      // Handle the JSON response data here
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
      toast.error("Please update streaming server!", { position: "bottom-center" });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
  };

  const handleChangeLineName = (e, index) => {
    const updatedLineNames = [...lineDetails];
    updatedLineNames[index].name = e.target.value;
    console.log("Changing line no.",index+1,updatedLineNames[index].name);
    setLineDetails(updatedLineNames);
  };
  const handleChangeRegionName = (e, index) => {
    const updatedRegionNames = [...regionDetails];
    updatedRegionNames[index].name = e.target.value;
    console.log(e.target.value);
    setRegionDetails(updatedRegionNames);
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
              {sourceOptions &&
                sourceOptions.map((sourceId, index) => (
                  <option key={index} value={sourceId}>
                    {sourceId}
                  </option>
                ))}
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
              {/* backend */}
              <option value="loitering">Loitering </option>
              <option value="crowd">Crowd</option>
              <option value="trespassing">Trespassing</option>
              <option value="vehicle_crossing">Vehicle Crossing</option>
              <option value="vehicle_stoppage">Vehicle Stoppage</option>
              <option value="object_abandoned">Abandoned Object</option>
              <option value="fire_detection">Fire Detection</option>
              <option value="scence_change">Scene Changed</option>
              <option value="object_theft">Object Theft</option>
            </select>
          </div>
        </form>
        {/* TABLE FOR LINE  */}
        {lineDetails.length > 0 && (
          <div className="line_region_row_table">
            <table>
              <thead>
                <tr>
                  <th>Line No.</th>
                  <th>Line Name</th>
                </tr>
              </thead>
              <tbody>
                {lineDetails.map((lineDetail, index) => (
                  <tr key={lineDetail.id}>
                    <td>{`${index + 1}`}</td>
                    <td className="line_region_row_table_edit_input">
                      <input
                        value={lineDetail.name}
                        placeholder={`Default : Line ${index + 1}`}
                        onChange={(e) => handleChangeLineName(e, index)}
                        // Add a unique key based on the index
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* TABLE FOR REGION  */}
        {/* {regionDetails.length > 0 && (
          <div className="line_region_row_table">
            <table>
              <thead>
                <tr>
                  <th>Region No.</th>
                  <th>Region Name</th>
                </tr>
              </thead>
              <tbody>
                {regionDetails.map((regionName, index) => (
                  <tr key={index}>
                    <td>{`${index + 1}`}</td>
                    <td className="line_region_row_table_edit_input">
                      <input
                        value={regionName}
                        placeholder={`Default : Region ${index + 1}`}
                        onChange={(e) => handleChangeRegionName(e, index)}
                        // Add a unique key based on the index
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} */}
      </div>

      <div className="canvas_container">
        {/* <img src={`data:image/jpeg;base64,${imageData}`}/> */}
        {formData.analytics === "loitering" ? (
          <RegionCanvas
          base64Image={imageData}
          formData={formData}
          regionNames={regionDetails}
          setRegionNames={setRegionDetails}
        />
        ) : formData.analytics === "trespassing" ? (
          <LineCanvas
            base64Image={imageData}
            formData={formData}
            lineDetails={lineDetails}
            setLineDetails={setLineDetails}
          />
        ) : formData.analytics === "crowd" ? (
          <RegionCanvas
          base64Image={imageData}
          formData={formData}
          regionNames={regionDetails}
          setRegionNames={setRegionDetails}
        />
        ) : formData.analytics === "vehicle_crossing" ? (
          <LineCanvas
            base64Image={imageData}
            formData={formData}
            lineDetails={lineDetails}
            setLineDetails={setLineDetails}
          />
        ) : formData.analytics === "vehicle_stoppage" ? (
          <RegionCanvas
          base64Image={imageData}
          formData={formData}
          regionNames={regionDetails}
          setRegionNames={setRegionDetails}
          />
        ) : formData.analytics === "object_theft" ? (
          <RegionCanvas
          base64Image={imageData}
          formData={formData}
          regionNames={regionDetails}
          setRegionNames={setRegionDetails}
          />
        ) :
        null}
      </div>
    </div>
  );
}

export default AnalyticsConfig;
