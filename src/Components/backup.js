import React, { useState, useEffect, useMemo, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { useTable, usePagination } from "react-table";
import { toast } from "react-toastify";

function Event() {
  const [messages, setMessages] = useState({headers:[],rowData:[]});
  const [sourceOptions, setSourceOptions] = useState(null);

  // get headers from json key from the socket then prepare column and update header

  const columns =useMemo(()=>{
    return messages.headers.map((header) => ({
      Header: header,
      accessor: header,
    }));
  },[])
 

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of 'rows', we use 'page' for paginated data
    prepareRow,
    state: { pageIndex, pageSize }, // State for pagination
    gotoPage, // Function to go to a specific page
    nextPage, // Function to go to the next page
    previousPage, // Function to go to the previous page
    canNextPage, // Boolean indicating if there is a next page
    canPreviousPage, // Boolean indicating if there is a previous page
    pageCount,
  } = useTable(
    { columns, data: messages.rowData, initialState: { pageIndex: 0, pageSize: 50 } },
    //data : messages; here messages also columns is expected to be a list hence you have to initalize it to a empty [] and no null
    usePagination
  );
  const socketRef = useRef(null); // Ref for socket
  const ENDPOINT = "http://localhost:5000/";

  useEffect(() => {
    getConfig();

    return () => {
      stopService();
    };
  }, []);

  const [formData, setFormData] = useState({
    sourceId: "",
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
    console.log('submit called');
    e.preventDefault();
    postData();
  }
  const stopService = () => {
    console.log("Stopping Service")

    if (socketRef.current) {
      axios
        .get(`http://localhost:5000/event_monitor`, {
          params: {
            stop_kafka_consumer: true,
          },
        })
        .then((res) => {
          console.log(res.data);
          if(socketRef.current)
          socketRef.current.disconnect();
        })
        .catch((e) => {
          toast.error(e, { position: "bottom-center" });
          console.log(e);
          if(socketRef.current)
          socketRef.current.disconnect();
        });
    }

  };
  async function getConfig() {
    const url = "http://localhost:5000/get_config";
    try {
      const response = await axios.get(url);

      const responseData = response.data; // Axios already parses the JSON response
      const jsonString = JSON.parse(responseData.status_message);
      
      const get_list = jsonString.map((object) => {
        return `SourceId : ${object.source_id} , Name : ${object.source_name}`;
        // return object.source_id
      });
      // console.log(get_list)
      setSourceOptions(get_list);
      // Handle the JSON response data here
    } catch (error) {
      // Handle errors here
      console.error("Axios error:", error);
      toast.error("Please update streaming server !", { position: "bottom-center" });

    }
  }
  async function postData() {
    console.log("------Post data form--------  ",formData)
    const json = {
      sourceId: formData.sourceId.split(',')[0].split(':')[1].trim(),
      analytics: formData.analytics,
    };
    console.log("---------sending json data----",json)

    const url = "http://localhost:5000/event_monitor";
    try {
      const response = await axios.post(url, json);
      toast("Messages are getting loaded ", { position: "bottom-center" });
      // console.log(response);

      if (response.status) {
        socketRef.current = socketIOClient(ENDPOINT);
        // Listen for 'kafka_msg_data' events
        socketRef.current.on("kafka_msg_data_for_em", (data) => {
          // Handle the received data (e.g., update the messages state)
          // console.log("this is data",data);
          console.log(data)

          const headerList=Object.keys(data)
          console.log(headerList);
          const rowList=[data, ...messages.rowData]
          const updatedMessages = {
            headers: headerList,
            rowData: rowList,
          };
          
          setMessages(updatedMessages)
          // console.log(updatedMessages);
        });
      }
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
          {/* <div className="sub_form_label_input"> */}
          <div className="label_input_container flex-row">

            <label>Source Id:</label>
            <select
              onChange={handleChange}
              value={formData.sourceId}
              name="sourceId"
            >
              <option value="null" hidden>
                Select Source ID
              </option>
              {/* <option value="SourceId : 1 , Name : hello">SourceId : 1 , Name : hello1</option>
              <option value="SourceId : 2 , Name : hello">SourceId : 2 , Name : hello2</option>
              <option value="1">1</option> */}
              {sourceOptions &&
                sourceOptions.map((sourceId, index) => (
                  <option key={index} value={sourceId}>
                    {sourceId}
                  </option>
                ))}
            </select>
          </div>

          {/* <div className="sub_form_label_input"> */}
          <div className="label_input_container flex-row">

            <label>Analytics : </label>
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
              <option value="scene_change">Scene Changed</option>
              <option value="object_theft">Object Theft</option>
            </select>
          </div>

          <button type="submit">SUBMIT</button>
          <button onClick={()=>{
            toast.error("Stopping Kafka consumer !", { position: "bottom-center" });
            stopService()
            }} type="button">STOP</button>
        </form>
      </div>

      {messages.rowData.length > 0 && (
        <div>
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
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td {...cell.getCellProps()}>
                            {" "}
                            {cell.render("Cell")}{" "}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="wrapper">
            <div className="pagination_controls">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="pagination_button"
              >
                {"<<"}
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="pagination_button"
              >
                {"<"}
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="pagination_button"
              >
                {">"}
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="pagination_button"
              >
                {">>"}
              </button>
              <span className="current_page">
                Page{" "}
                <strong>
                  {pageIndex + 1} of {pageCount}
                </strong>{" "}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Event;
