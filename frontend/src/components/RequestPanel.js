import React, { useState, useEffect } from "react";

const RequestPanel = ({
  client,
  requestUrl,
  panelName,
  requestData,
  clearData,
}) => {
  const [startTime, setStartTime] = useState(0);
  const [responseTimes, setResponseTimes] = useState([]);

  useEffect(() => {
    if (
      startTime > 0 &&
      !isNaN(requestData.endTime) &&
      !isNaN(startTime) &&
      requestData.endTime > startTime
    ) {
      const timeElapsed = requestData.endTime - startTime;
      setResponseTimes((oldTimes) => {
        oldTimes.push(timeElapsed);
        return oldTimes;
      });
    }
  }, [requestData.endTime, startTime]);
  const sendRequest = () => {
    clearData();
    setStartTime(Date.now());
    const stringLength = document.getElementById("string-length")
      ? document.getElementById("string-length").value
      : 256;
    if (client) {
      client.sendMessage(
        requestUrl,
        JSON.stringify({ stringLength: stringLength })
      );
    }
  };
  const totalTime = responseTimes.reduce((total, value) => total + value, 0);
  const averageResponseTime =
    responseTimes.length > 0 ? totalTime / responseTimes.length : "-";
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div>
        <div>Percent: {requestData.percent}</div>
        <div>Objects Received: {requestData.numReceived}</div>
        <div>Chars Received: {requestData.charsReceived}</div>
        <div>Average Response Time: {averageResponseTime}</div>
        <button type="button" onClick={() => sendRequest()}>
          {panelName}
        </button>
      </div>
    </div>
  );
};

export default RequestPanel;
