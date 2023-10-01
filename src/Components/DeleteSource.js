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
      });

    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
      toast.error(error.message, { position: "bottom-center" })

    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="cam_config_sub_form">
        <div className="sub_form_label_input">
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
