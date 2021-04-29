import React, { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import logo from "./logo.svg";
import "./App.css";

let stompClient = null;

const singleResponse = (
  setSinglePercent,
  setSingleNumReceived,
  setSingleTimeStart
) => {
  const stringLength = document.getElementById("string-length").value;
  setSinglePercent(0.0);
  setSingleNumReceived(0);
  setSingleTimeStart(Date.now());
  stompClient.send("/app/test", {}, JSON.stringify({ stringLength }));
};

const batchResponse = (
  setBatchPercent,
  setBatchNumReceived,
  setBatchTimeStart,
  setBatchCharsReceived
) => {
  const stringLength = document.getElementById("string-length").value;
  setBatchPercent(0.0);
  setBatchNumReceived(0);
  setBatchCharsReceived(0);
  setBatchTimeStart(Date.now());
  stompClient.send("/app/batch-test", {}, JSON.stringify({ stringLength }));
};

const setConnected = (isConnected) => {};

const connect = (
  setSinglePercent,
  setSingleNumReceived,
  setBatchPercent,
  setBatchNumReceived,
  setSingleTimeEnd,
  setBatchTimeEnd,
  setSingleCharsReceived,
  setBatchCharsReceived
) => {
  const socket = new SockJS("/gs-guide-websocket");
  stompClient = Stomp.over(socket);
  stompClient.debug = null;
  stompClient.connect({}, function (frame) {
    setConnected(true);
    stompClient.subscribe("/topic/testing", function (response) {
      const contentReceived = JSON.parse(response.body).content;
      const percentDone = JSON.parse(response.body).percent;
      setSinglePercent(percentDone);
      setSingleNumReceived(contentReceived.length);
      setSingleTimeEnd(Date.now());
      let charsReceived = 0;
      for (let i = 0; i < contentReceived.length; i++) {
        charsReceived += contentReceived[i].length;
      }
      setSingleCharsReceived(charsReceived);
    });
    stompClient.subscribe("/topic/batch-test", function (response) {
      const contentReceived = JSON.parse(response.body).content;
      const percentDone = JSON.parse(response.body).percent;
      console.log("new percent done = " + percentDone);
      setBatchPercent(percentDone);
      setBatchNumReceived((currentReceived) => {
        console.log("adding " + contentReceived.length + " to num received");
        const newTotal = currentReceived + contentReceived.length;
        console.log("new total: " + newTotal);
        return newTotal;
      });
      let charsReceived = 0;
      for (let i = 0; i < contentReceived.length; i++) {
        charsReceived += contentReceived[i].length;
      }
      setBatchCharsReceived((chars) => chars + charsReceived);
      if (percentDone >= 99) {
        setBatchTimeEnd(Date.now());
      }
    });
  });
};
function App() {
  const [singlePercent, setSinglePercent] = useState(0.0);
  const [singleNumReceived, setSingleNumReceived] = useState(0);
  const [batchPercent, setBatchPercent] = useState(0.0);
  const [batchNumReceived, setBatchNumReceived] = useState(0);
  const [singleTimeStart, setSingleTimeStart] = useState(0);
  const [singleTimeEnd, setSingleTimeEnd] = useState(0);
  const [batchTimeStart, setBatchTimeStart] = useState(0);
  const [batchTimeEnd, setBatchTimeEnd] = useState(0);
  const [singleCharsReceived, setSingleCharsReceived] = useState(0);
  const [batchCharsReceived, setBatchCharsReceived] = useState(0);
  useEffect(() => {
    connect(
      setSinglePercent,
      setSingleNumReceived,
      setBatchPercent,
      setBatchNumReceived,
      setSingleTimeEnd,
      setBatchTimeEnd,
      setSingleCharsReceived,
      setBatchCharsReceived
    );
  }, []);
  return (
    <div className="App">
      <div>
        <p>
          Enter length of string response to test different websocket
          strategies. Each request will generate 100 strings of the given length
          and return results through a websocket connection. Single result
          returns all 100 in a single frame. Multiple responses returns 10
          groups of 10 strings as multiple resonses.
        </p>
        <div>
          <input id="string-length" type="text" />
        </div>
        <div>Percent: {singlePercent}</div>
        <div>Objects Received: {singleNumReceived}</div>
        <div>Chars Received: {singleCharsReceived}</div>
        <div>Time Elapsed: {Math.max(singleTimeEnd - singleTimeStart, 0)}</div>
        <button
          type="button"
          onClick={() =>
            singleResponse(
              setSinglePercent,
              setSingleNumReceived,
              setSingleTimeStart
            )
          }
        >
          Single Response
        </button>
      </div>
      <div>
        <div>Percent: {batchPercent}</div>
        <div>Objects Received: {batchNumReceived}</div>
        <div>Chars Received: {batchCharsReceived}</div>
        <div>Time Elapsed: {Math.max(batchTimeEnd - batchTimeStart, 0)}</div>
        <button
          type="button"
          onClick={() =>
            batchResponse(
              setBatchPercent,
              setBatchNumReceived,
              setBatchTimeStart,
              setBatchCharsReceived
            )
          }
        >
          Multiple Responses
        </button>
      </div>
    </div>
  );
}

export default App;
