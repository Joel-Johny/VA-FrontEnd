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
        const response = await fetch(ENDPOINT);

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        // setting to state
        console.log(data);
        setAddress((prevAddress) => ({
          ...prevAddress,
          analytics_server_ip: data.analytics_server_ip,
          message_broker_address: data.message_broker_address,
          streaming_server_ip:data.streaming_server_ip
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
      <div className="dashboard">
      <h2>Welcome to Our Website</h2>

      <form onSubmit={handleSubmitAddress} className="cam_config_sub_form flex-col">
        <div className="sub_form_label_input">
          <label className="dash-label">Analytics Server Address :</label>
          <input
            type="url"
            name="analytics_server_ip"
            value={address.analytics_server_ip}
            onChange={handleChangeAddress}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label className="dash-label">Message Broker Address : </label>
          <input
            type="url"
            name="message_broker_address"
            value={address.message_broker_address}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <div className="sub_form_label_input">
          <label className="dash-label">Streaming Server IP : </label>
          <input
            type="url"
            name="streaming_server_ip"
            value={address.streaming_server_ip}
            onChange={handleChangeAddress}
            required
          />
        </div>
        <button type="submit">SUBMIT</button>

      </form>
      </div>

    </div>
  );
}

export default Dashboard;
