import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ReactJson from 'react-json-pretty';

const GetConfig = () => {

  const [getConfig, setGetConfig] = useState(null);
  async function getRequest() {

    const url = "http://localhost:5000/get_config";
    try {
      const response = await axios.get(url);

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response
      setGetConfig(responseData)
      // Handle the JSON response data here
      console.log("Response data:", responseData);
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }
console.log(getConfig)
  return (
    <div>
      <form className="cam_config_sub_form">
        <button onClick={getRequest}>Get Data</button>
      </form>
      <div className="configContainer">{getConfig ? (<ReactJson data={getConfig} />) : (<p></p>)}</div>


    </div>
  );
};

export default GetConfig;
