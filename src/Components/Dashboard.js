import React, { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [address, setAddress] = useState({
    analytics_server_ip: "",
    message_broker_address: "",
    streaming_server_ip: "",
  });

  useEffect(() => {
    const ENDPOINT = "http://127.0.0.1:5000/";

    async function fetchData() {
      try {
        const response = await axios.get(ENDPOINT);
        
        // if (!response.statusText) throw new Error("Network response was not ok");
        // const data = await response.json();
        
        // setting to state
        setAddress((prevAddress) => ({
          ...prevAddress,
          analytics_server_ip: response.data.analytics_server_ip,
          message_broker_address: response.data.message_broker_address,
          streaming_server_ip:response.data.streaming_server_ip
        }));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, []);

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", address);
    postData();
  };

  async function postData() {
    const url = "http://localhost:5000/";
    try {
      const response = await axios.post(url, address);

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response

      // Handle the JSON response data here
      console.log("Response data:", responseData);
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }
  return (
    <div className="main_page">
      <h2>Welcome to Our Website</h2>
      <p>This is the Dashboard page</p>
      <form onSubmit={handleSubmitAddress}>
        <div>
          <label>Analytics Server Address :</label>
          <input
            type="url"
            name="analytics_server_ip"
            value={address.analytics_server_ip}
            onChange={handleChangeAddress}
            required
          />
        </div>

        <div>
          <label>Message Broker Address : </label>
          <input
            type="url"
            name="message_broker_address"
            value={address.message_broker_address}
            onChange={handleChangeAddress}
            required
          />

          <label>Streaming Server IP : </label>
          <input
            type="url"
            name="streaming_server_ip"
            value={address.streaming_server_ip}
            onChange={handleChangeAddress}
            required
          />
          <br />
          <input type="submit" value="Connect" />
        </div>
      </form>
    </div>
  );
}

export default Dashboard;
