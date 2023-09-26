import React, { useState } from "react";
import axios from "axios";

function DeleteAnalytics() {
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

  const url = "http://localhost:5000/delete_inference";
  try {
    const response = await axios.delete(url, { data : formData});
    

    console.log(response);

    const responseData = response.data; // Axios already parses the JSON response

    // Handle the JSON response data here
    console.log("Response data:", responseData);
  } 
  catch (error) {
    // Handle errors here
    console.error("Axios error:", error);
  }
}

  return (
    <div>
      <h2>Form to Remove Analytics</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="sourceId">Source Id:</label>
          <input
            type="number"
            name="source_id"
            value={formData.sourceId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="sourceFrameRate">Analytics : </label>
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DeleteAnalytics;