import SockJS from "sockjs-client";
import webstomp from "webstomp-client";

class Websocket {
  stompClient = null;
  subscriptions = [];

  connect(url) {
    var socket = new SockJS("/gs-guide-websocket");
    this.stompClient = webstomp.over(socket);
    this.stompClient.debug = () => {};
    this.stompClient.connect({}, (frame) => {
      this.subscriptions.forEach((element) => {
        this.stompClient.subscribe(element.destination, element.callback);
      });
    });
  }

  addSubscription(destination, callback) {
    this.subscriptions.push({
      destination,
      callback,
    });
  }

  sendMessage(destination, body) {
    this.stompClient.send(destination, body, {});
  }
}

export default Websocket;
