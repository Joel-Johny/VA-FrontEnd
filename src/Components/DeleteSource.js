import { toast } from "react-toastify";
import React, { useState } from "react";
import axios from "axios";

function DeleteSource() {
  const [formData, setFormData] = useState({
    source_id: "",
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

  const url = "http://localhost:5000/delete_source";
  try {
    const response = await axios.delete(url, {data : formData});

    console.log(response);

    const responseData = response.data; // Axios already parses the JSON response

    // Handle the JSON response data here
    console.log("Response data:", responseData);
    toast(responseData.status_message,{position:"bottom-center"})

  } catch (error) {
    // Handle errors here
    console.error("Axios error:", error);
    toast.error(error,{position: "bottom-center"})

  }
}

  return (
    <div>
      <h2>Form to delete source</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label >Source Id:</label>
          <input
            type="text"
            name="source_id"
            value={formData.source_id}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default DeleteSource;
