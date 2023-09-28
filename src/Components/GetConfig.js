import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReactJson from "react-json-pretty";
import GetConfigTable from "./GetConfigTable"

const GetConfig = () => {
  const [getConfig, setGetConfig] = useState(null);
  async function getRequest(e) {
    e.preventDefault();
    const url = "http://localhost:5000/get_config";
    try {
      const response = await axios.get(url);
      const responseData = response.data; // Axios already parses the JSON response
      // setGetConfig(responseData.status_message);
      setGetConfig(JSON.parse(responseData.status_message));

      // Handle the JSON response data here

      console.log("Response data:", responseData.status_message);
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }

  const columns =  [
      {
        Header: "Source ID",
        accessor: "source_id",
      },
      {
        Header: "Source Name",
        accessor: "source_name",
      },
      {
        Header: "RTSP URL",
        accessor: "rtsp_url",
      },
    ]

  console.log(getConfig);
  return (
    <div>
      <form className="cam_config_sub_form">
        <button onClick={getRequest}>Get Data</button>
      </form>
      <div className="configContainer">
         {getConfig &&<GetConfigTable dataObjectsList={getConfig}/>} 
        {/* {getConfig ? <ReactJson data={getConfig} /> : <p></p>} */}
      </div>
    </div>
  );
};

export default GetConfig;
