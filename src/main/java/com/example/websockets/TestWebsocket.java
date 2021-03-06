package com.example.websockets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class TestWebsocket {
  private SimpMessageSendingOperations template;
  private final int MESSAGE_SIZE = 100;
  private final int CHARS_PER_MB = 1050025;

  @Autowired
  public TestWebsocket(SimpMessagingTemplate template) {
    this.template = template;
  }

  @MessageMapping("test")
  @SendTo("/topic/testing")
  public WsResponse test(WsRequest request) {
    WsResponse response = new WsResponse();
    int totalCharacters = request.getPayloadSize() * CHARS_PER_MB;
    int charactersPerMessage = totalCharacters / MESSAGE_SIZE;

    for (int i = 0; i < MESSAGE_SIZE; i++) {
      response.getContent().add(generateLargeString(charactersPerMessage));
    }
    response.setPercent(100.0f);
    return response;
  }

  @MessageMapping("batch-test")
  public void batchTest(WsRequest request) {
    int totalCharacters = request.getPayloadSize() * CHARS_PER_MB;
    int charactersPerMessage = totalCharacters / MESSAGE_SIZE;
    for (int i = 0; i < 10; i++) {
      WsResponse response = new WsResponse();
      for (int j = 0; j < 10; j++) {
        response.getContent().add(generateLargeString(charactersPerMessage));
      }
      float percentDone = (i + 1) * 10;
      response.setPercent(percentDone);
      template.convertAndSend("/topic/batch-test", response);
    }

  }

  private String generateLargeString(int stringLength) {
    StringBuilder sb = new StringBuilder(stringLength);
    for (int j = 0; j < stringLength; j++) {
      sb.append("a");
    }
    return sb.toString();
  }
}
