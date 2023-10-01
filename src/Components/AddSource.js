import React, { useState } from "react";
import { toast } from "react-toastify";

import axios from "axios";
function AddSource() {
  const [formData, setFormData] = useState({
    source_id: "",
    source_name: "",
    rtsp_url: "",
    username: "",
    password: "",
    source_rate: "",
    analytics: "",
    publish_image: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Check if the input element is a checkbox
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked, // Set the checkbox value directly
      });
    } else {
      // Handle other input types (text, etc.)
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    postData();
  };
  async function postData() {
    const url = "http://localhost:5000/add_new_source";
    try {
      const response = await axios.post(url, formData);

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response

      setFormData({
        source_id: "",
        source_name: "",
        rtsp_url: "",
        username: "",
        password: "",
        source_rate: "",
        analytics: "",
        publish_image: false, 
      });

      // Handle the JSON response data here
      console.log("Response data:", responseData);
      toast(responseData.status_message, { position: "bottom-center" });
    } catch (error) {
      // Handle errors here
      console.log("Axios error:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  }

  // const showToast = () => {
  //   toast("This is a toast message!",{    position: "bottom-center", // or "bottom-left" for left-aligned
  // });

  // };

  return (
    <div>
      <form onSubmit={handleSubmit} className="cam_config_sub_form">
        <div className="sub_form_label_input">
          <label htmlFor="sourceId">Source Id:</label>
          <input
            type="number"
            name="source_id"
            value={formData.source_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="sub_form_label_input">
          <label htmlFor="sourceName">Source Name : </label>
          <input
            type="text"
            name="source_name"
            value={formData.source_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label htmlFor="rtspUrl">RTSP URL : </label>
          <input
            // type="url"
            name="rtsp_url"
            value={formData.rtsp_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label htmlFor="username">Username : </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label htmlFor="password">Password : </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label htmlFor="sourceFrameRate">Source Frame Rate : </label>
          <input
            type="number"
            name="source_rate"
            value={formData.source_rate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label htmlFor="analytics">Analytics : </label>

          <select
            onChange={handleChange}
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

        <div className="sub_form_label_input">
          <label htmlFor="PublishImage">Publish Image : </label>
          <input
            type="checkbox"
            name="publish_image"
            checked={formData.publish_image}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {/* <button onClick={showToast}>Show Toast</button> */}
    </div>
  );
}

export default AddSource;
