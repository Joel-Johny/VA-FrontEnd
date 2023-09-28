import React, { useEffect, useState, useRef } from "react";
import LineCanvas from "./LineCanvas";
import RegionCanvas from "./RegionCanvas";
import axios from "axios";
import socketIOClient from "socket.io-client";

function AnalyticsConfig() {
  const ENDPOINT = "http://localhost:5000"; // Replace with your Flask server's URL
  const socketRef = useRef(null); // Ref for socket
  const [formData, setFormData] = useState({
    sourceId: "",
    analytics: "",
  });
  const [imageData, setImageData] = useState(null);
  const [sourceOptions, setSourceOptions] = useState(null);
  const [lineNames, setLineNames] = useState([]);
  const [regionNames, setRegionNames] = useState([]);

  useEffect(() => {
    getConfig();

    // socketRef.current = socketIOClient(ENDPOINT);

    // socketRef.current.on("connect", () => {
    //   console.log("Connected to the server via WebSocket");
    // });
    // socketRef.current.on("kafka_msg_data", (data) => {
    //   // Convert the received BSON encoded data to a JavaScript object
    //   console.log("Here is data from the socket",data);
    //   setImageData(data.base64_url);
    // });

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

  const handleChangeAnalytics = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("Calling getImage Image making a get request....");
    setLineNames([]);
    setRegionNames([]);
    getImage();
  };

  async function getImage() {
    const url = "http://localhost:5000/custom"; // ORG : http://localhost:5000/get_image

    try {
      const response = await axios.get(url);
      console.log(response);
      if (response.status == 200) {
        socketRef.current = socketIOClient(ENDPOINT);
        socketRef.current.on("connect", () => {
          console.log("Connected to the server via WebSocket");
        });
        socketRef.current.on("kafka_msg_data", (data) => {
          // Convert the received BSON encoded data to a JavaScript object
          console.log("Here is data from the socket", data);
          setImageData(data.base64_url);

          socketRef.current.disconnect();
          console.log("WebSocket disconnected");
        });
      }
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
      console.log(responseData.status_message);
      // const jsonString = JSON.parse(responseData.status_message);

      const get_list = responseData.status_message.map((object) => {
        // return `SourceId : ${object.source_id} , Name : ${object.source_name}`
        return object.source_id;
      });
      // console.log(get_list)

      setSourceOptions(get_list);
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

  const handleChangeLineName = (e, index) => {
    const updatedLineNames = [...lineNames];
    updatedLineNames[index] = e.target.value;
    console.log(e.target.value);
    setLineNames(updatedLineNames);
  };
  const handleChangeRegionName = (e, index) => {
    const updatedRegionNames = [...regionNames];
    updatedRegionNames[index] = e.target.value;
    console.log(e.target.value);
    setRegionNames(updatedRegionNames);
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
        {/* TABLE FOR LINE  */}
        {lineNames.length > 0 && (
          <div className="line_region_row_table">
            <table>
              <thead>
                <tr>
                  <th>Line No.</th>
                  <th>Line Name</th>
                </tr>
              </thead>
              <tbody>
                {lineNames.map((lineName, index) => (
                  <tr key={index}>
                    <td>{`${index + 1}`}</td>
                    <td className="line_region_row_table_edit_input">
                      <input
                        value={lineName}
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
        {regionNames.length > 0 && (
          <div className="line_region_row_table">
            <table>
              <thead>
                <tr>
                  <th>Region No.</th>
                  <th>Region Name</th>
                </tr>
              </thead>
              <tbody>
                {regionNames.map((regionName, index) => (
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
        )}
      </div>

      <div className="canvas_container">
        {/* <img src={`data:image/jpeg;base64,${imageData}`}/> */}
        {formData.analytics === "Line Crossing" ? (
          <LineCanvas
            base64Image={imageData}
            formData={formData}
            lineNames={lineNames}
            setLineNames={setLineNames}
          />
        ) : formData.analytics === "Crowd" ? (
          <RegionCanvas
            base64Image={imageData}
            formData={formData}
            regionNames={regionNames}
            setRegionNames={setRegionNames}
          />
        ) : formData.analytics === "Loitering" ? (
          <LineCanvas
            base64Image={imageData}
            formData={formData}
            lineNames={lineNames}
            setLineNames={setLineNames}
          />
        ) : //need to make seperate canvas for loitering ->Line / Region
        null}
      </div>
    </div>
  );
}

export default AnalyticsConfig;
