import React from "react";

const RequestPanel = ({ responseData }) => {
  const totalTime = responseData.responseTimes.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
  const averageResponseTime =
    responseData.responseTimes.length > 0
      ? parseFloat(totalTime / responseData.responseTimes.length).toFixed(2)
      : "-";
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly" }}>
      <div>
        <div>Percent: {responseData.percentDone}</div>
        <div>Objects Received: {responseData.objectsReceived}</div>
        <div>Chars Received: {responseData.charsReceived}</div>
        <div>Average Response Time: {averageResponseTime}</div>
      </div>
    </div>
  );
};

export default RequestPanel;
