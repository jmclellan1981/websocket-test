import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Websocket from "./websockets/Websocket";
import RequestPanel from "./components/RequestPanel";
import {
  updatePercentDone as updateSinglePercentDone,
  updateCharsReceived as updateSingleCharsReceived,
  updateObjectsReceived as updateSingleObjectsReceived,
  addResponseTime as addSingleResponseTime,
  resetData as resetSingleData,
} from "./redux/singleResponseTimesSlice";

import {
  updatePercentDone as updateMultiplePercentDone,
  updateCharsReceived as updateMultipleCharsReceived,
  updateObjectsReceived as updateMultipleObjectsReceived,
  addResponseTime as addMultipleResponseTime,
  resetData as resetMultiData,
} from "./redux/multiResponseTimesSlice";
import "./App.css";

const SINGLE_REPLY = "/app/test";
const MULTI_REPLY = "/app/batch-test";

function App() {
  const dispatch = useDispatch();
  const singleData = useSelector((state) => state.singleReplyData);
  const multiData = useSelector((state) => state.multiReplyData);
  const [stompClient, setStompClient] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const startTimeRef = useRef();
  startTimeRef.current = startTime;

  const sendRequest = (requestUrl) => {
    if (requestUrl === SINGLE_REPLY) {
      dispatch(resetSingleData());
    } else {
      dispatch(resetMultiData());
    }
    setStartTime(Date.now());
    const payloadSize = document.getElementById("payload-size")
      ? document.getElementById("payload-size").value
      : 1;
    if (stompClient) {
      stompClient.sendMessage(
        requestUrl,
        JSON.stringify({ payloadSize: payloadSize })
      );
    }
  };

  const batchResponse = useCallback(
    (response) => {
      const contentReceived = JSON.parse(response.body).content;
      const percentDone = JSON.parse(response.body).percent;
      if (percentDone === 100) {
        const endTime = Date.now();
        const responseTime = endTime - startTimeRef.current;
        dispatch(addMultipleResponseTime(responseTime));
      }
      let charsReceived = 0;
      for (let i = 0; i < contentReceived.length; i++) {
        charsReceived += contentReceived[i].length;
      }
      dispatch(updateMultiplePercentDone(percentDone));
      dispatch(updateMultipleCharsReceived(charsReceived));
      dispatch(updateMultipleObjectsReceived(contentReceived.length));
    },
    [dispatch]
  );

  useEffect(() => {
    const websocket = new Websocket();
    websocket.connect("/app/gs-guide-websocket");
    setStompClient(websocket);
  }, []);
  useEffect(() => {
    const singleResponse = (response) => {
      const contentReceived = JSON.parse(response.body).content;
      const percentDone = JSON.parse(response.body).percent;
      const endTime = Date.now();
      const responseTime = endTime - startTimeRef.current;
      let charsReceived = 0;
      for (let i = 0; i < contentReceived.length; i++) {
        charsReceived += contentReceived[i].length;
      }
      dispatch(addSingleResponseTime(responseTime));
      dispatch(updateSinglePercentDone(percentDone));
      dispatch(updateSingleCharsReceived(charsReceived));
      dispatch(updateSingleObjectsReceived(contentReceived.length));
    };

    if (stompClient) {
      stompClient.addSubscription("/topic/batch-test", (response) =>
        batchResponse(response)
      );
      stompClient.addSubscription("/topic/testing", (response) =>
        singleResponse(response)
      );
    }
  }, [batchResponse, dispatch, startTime, stompClient]);
  return (
    <div className="App">
      <p>
        Enter payload size to test different websocket strategies. Each request
        will generate 100 strings with total size equaling the input and return
        results through a websocket connection. Single result returns all 100 in
        a single frame. Multiple responses returns 10 groups of 10 strings as
        multiple responses.
      </p>

      <div>
        <span>
          Payload Size (in MB): <input id="payload-size" type="number" />
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div>
          <RequestPanel responseData={singleData} />
          <button type="button" onClick={() => sendRequest(SINGLE_REPLY)}>
            Single Response
          </button>
        </div>
        <div>
          <RequestPanel responseData={multiData} />
          <button type="button" onClick={() => sendRequest(MULTI_REPLY)}>
            Multiple Responses
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
