import React, { useState, useEffect, useMemo, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { useTable } from "react-table";
import fakeData from "./mock.json";

function Event() {
  const [messages, setMessages] = useState([]);
  const data = React.useMemo(() => fakeData, []);
  const [sourceOptions, setSourceOptions] = useState(null);

  const columns = React.useMemo(
    () => [
      {
        Header: "Source",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "first_name",
      },
      {
        Header: "Frame",
        accessor: "last_name",
      },
      {
        Header: "Timestamp",
        accessor: "email",
      },
      {
        Header: "Time",
        accessor: "gender",
      },
      {
        Header: "University",
        accessor: "university",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });
  // const socketRef = useRef(null); // Ref for socket

  useEffect(() => {
    getConfig();

    const ENDPOINT = "http://localhost:5000/";
    const socketRef = socketIOClient(ENDPOINT);
    // Listen for 'kafka_msg_data' events
    socketRef.on("kafka_msg_data", (data) => {
      // Handle the received data (e.g., update the messages state)
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Clean up the interval and disconnect the WebSocket when the component unmounts
    return () => {
      socketRef.disconnect();
      stopService();
    };
  }, []);

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
  const stopService = () => {
    axios
      .get(`http://localhost:5000/event_monitor`, {
        params: {
          stop_kafka_consumer: true,
        },
      })
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
  };
  async function getConfig() {
    const url = "http://localhost:5000/get_config";
    try {
      const response = await axios.get(url);

      const responseData = response.data; // Axios already parses the JSON response
      const jsonString = JSON.parse(responseData.status_message);
      const get_list = jsonString.status_message.map((object) => {
        return `SourceId : ${object.source_id} , Name : ${object.source_name}`;
        // return object.source_id
      });
      // console.log(get_list)
      console.log(formData.sourceId);
      setSourceOptions(get_list);
      console.log(formData.sourceId);
      // Handle the JSON response data here
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
    }
  }
  async function postData() {
    const url = "http://localhost:5000/event_monitor";
    try {
      const response = await axios.post(url, formData);

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

      <div className="event_monitor_form_container">
        <h2>Event Monitor</h2>
        <form onSubmit={handleSubmit} className="cam_config_sub_form">
        <div className="sub_form_label_input">
          <label>Source Id:</label>
          <select
            onChange={handleChange}
            value={formData.sourceId}
            name="sourceId"
          >
            <option value="null" hidden>
              Select Source ID
            </option>
            {sourceOptions &&
              sourceOptions.map((sourceId, index) => (
                <option key={index} value={sourceId}>
                  {sourceId}
                </option>
              ))}
          </select>
        </div>

        <div className="sub_form_label_input"> 
          <label>Analytics : </label>
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
        <button onClick={stopService}>STOP</button>
        </form>
      </div>

      <div className="wrapper">
        <div className="table_container">
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}> {cell.render("Cell")} </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Event;
