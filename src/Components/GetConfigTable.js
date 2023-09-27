import React from "react";

function GetConfigTable({ dataObjectsList }) {
  return (
    <div className="getConfigTable">
      <table>
        <thead>
          <tr>
            <th>Source ID</th>
            <th>Source Name</th>
            <th>RTSP URL</th>
          </tr>
        </thead>
        <tbody>
          {dataObjectsList.map((object) => (
            <tr key={object.source_id}>
              <td>{object.source_id}</td>
              <td>{object.source_name}</td>
              <td>{object.video_source.rtsp_url}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GetConfigTable;
