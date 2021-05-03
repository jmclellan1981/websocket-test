import React, { useState, useEffect } from "react";
import Websocket from "./websockets/Websocket";
import RequestPanel from "./components/RequestPanel";
import "./App.css";

function App() {
  const [stompClient, setStompClient] = useState(null);
  const [singleRequestData, setSingleRequestData] = useState({
    percent: 0,
    numReceived: 0,
    charsReceived: 0,
  });
  const [batchRequestData, setBatchRequestData] = useState({
    percent: 0,
    numReceived: 0,
    charsReceived: 0,
    endTime: Date.now(),
  });
  const clearSingleResponseData = () => {
    setSingleRequestData({
      percent: 0,
      numReceived: 0,
      charsReceived: 0,
    });
  };
  const clearBatchResponseData = () => {
    setBatchRequestData({
      percent: 0,
      numReceived: 0,
      charsReceived: 0,
    });
  };
  const singleResponse = (response) => {
    const contentReceived = JSON.parse(response.body).content;
    const percentDone = JSON.parse(response.body).percent;
    let charsReceived = 0;
    for (let i = 0; i < contentReceived.length; i++) {
      charsReceived += contentReceived[i].length;
    }
    setSingleRequestData((oldData) => ({
      percent: percentDone,
      numReceived: oldData.numReceived + contentReceived.length,
      charsReceived: oldData.charsReceived + charsReceived,
      endTime: Date.now(),
    }));
  };

  const batchResponse = (response) => {
    const contentReceived = JSON.parse(response.body).content;
    const percentDone = JSON.parse(response.body).percent;

    let charsReceived = 0;
    for (let i = 0; i < contentReceived.length; i++) {
      charsReceived += contentReceived[i].length;
    }
    setBatchRequestData((oldData) => ({
      percent: percentDone,
      numReceived: oldData.numReceived + contentReceived.length,
      charsReceived: oldData.charsReceived + charsReceived,
      endTime: Date.now(),
    }));
  };
  useEffect(() => {
    const websocket = new Websocket();
    websocket.addSubscription("/topic/batch-test", (response) =>
      batchResponse(response)
    );
    websocket.addSubscription("/topic/testing", (response) =>
      singleResponse(response)
    );
    websocket.connect("/app/gs-guide-websocket");
    setStompClient(websocket);
  }, []);
  return (
    <div className="App">
      <p>
        Enter length of string response to test different websocket strategies.
        Each request will generate 100 strings of the given length and return
        results through a websocket connection. Single result returns all 100 in
        a single frame. Multiple responses returns 10 groups of 10 strings as
        multiple resonses.
      </p>

      <div>
        <input id="string-length" type="text" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <RequestPanel
          client={stompClient}
          requestUrl="/app/test"
          panelName="Single Response"
          requestData={singleRequestData}
          clearData={clearSingleResponseData}
        />
        <RequestPanel
          client={stompClient}
          requestUrl="/app/batch-test"
          panelName="Multiple Responses"
          requestData={batchRequestData}
          clearData={clearBatchResponseData}
        />
      </div>
    </div>
  );
}

export default App;
