import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";

function DeleteAnalytics() {
  const [formData, setFormData] = useState({
    source_id: "",
    analytics: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
  };

  async function postData() {
    const url = "http://localhost:5000/delete_inference";
    try {
      const response = await axios.delete(url, { data: formData });

      console.log(response);

      const responseData = response.data; // Axios already parses the JSON response

      // Handle the JSON response data here
      console.log("Response data:", responseData);
      if (responseData.status_reason !== "")
        toast(responseData.status_reason, { position: "bottom-center" });
      else if (responseData.status_code === 200)
        toast("Successfully deleted", { position: "bottom-center" });
      else
        toast.error("Failed", { position: "bottom-center" });

      setFormData({
        source_id: "",
        analytics: ""
      })
    }

    catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
      toast.error(error.message, { position: "bottom-center" });
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="cam_config_sub_form">
        <div className="sub_form_label_input">
          <label htmlFor="sourceId">Source Id:</label>
          <input
            type="number"
            name="source_id"
            value={formData.sourceId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sub_form_label_input">
          <label htmlFor="sourceFrameRate">Analytics : </label>
          <select
            onChange={handleChange}
            value={formData.analytics}
            name="analytics"
          >
            <option value="null" hidden>
              Select Mode
            </option>
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DeleteAnalytics;
