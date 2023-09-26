import React, { useState } from "react";
import AddSource from "./AddSource";
import AddAnalytics from "./AddAnalytics";
import DeleteSource from "./DeleteSource";
import DeleteAnalytics from "./DeleteAnalytics";
import GetConfig from "./GetConfig";

function CameraConfig() {
  const [selectedOption, setSelectedOption] = useState("");

  // Define a function to handle dropdown selection
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="main_page">
      <h1>Configurations Page</h1>
      <select onChange={handleDropdownChange} value={selectedOption}>
        <option value="">Select API</option>
        <option value="form1">Add New Source</option>
        <option value="form2">Add Analytics to Source</option>
        <option value="form3">Remove Analytics from Source</option>
        <option value="form4">Delete Source</option>
        <option value="form5">Get Configurations</option>
      </select>

      {/* Render forms based on the selected option */}
      {selectedOption === "form1" && <AddSource />}
      {selectedOption === "form2" && <AddAnalytics />}
      {selectedOption === "form3" && <DeleteAnalytics />}
      {selectedOption === "form4" && <DeleteSource />}
      {selectedOption === "form5" && <GetConfig/>}
    </div>
  );
}

export default CameraConfig;
