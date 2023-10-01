import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";


function AddAnalytics() {
  const [formData, setFormData] = useState({
    source_id: "",
    analytics: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postData()

  };

  async function postData() {

  const url = "http://localhost:5000/add_inference";
  try {
    const response = await axios.post(url, formData);

    console.log(response);

    const responseData = response.data; // Axios already parses the JSON response

    // Handle the JSON response data here
    console.log("Response data:", responseData);
    toast(responseData.status_message,{position:"bottom-center"})

    setFormData({
      source_id: "",
      analytics: ""
    })


  } catch (error) {
    // Handle errors here
    console.error("Axios error:", error);
    toast.error(error.message, { position: "bottom-center" });

  }
}


  return (
    <div>
      <form onSubmit={handleSubmit} className="cam_config_sub_form">
        <div className="sub_form_label_input">
          <label >Source Id:</label>
          <input
            type="number"
            name="source_id"
            value={formData.source_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label >Analytics : </label>
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

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
}

export default AddAnalytics;
