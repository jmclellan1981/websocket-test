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
  private final int MESSAGE_SIZE_IN_MBS = 50;
  private final int CHARS_PER_MB = 512000;

  @Autowired
  public TestWebsocket(SimpMessagingTemplate template) {
    this.template = template;
  }

  @MessageMapping("test")
  @SendTo("/topic/testing")
  public WsResponse test(WsRequest request) {
    WsResponse response = new WsResponse();
    for (int i = 0; i < MESSAGE_SIZE_IN_MBS; i++) {
      response.getContent().add(generateOneMbString());
    }
    response.setPercent(100.0f);
    return response;
  }

  @MessageMapping("batch-test")
  public void batchTest(WsRequest request) {
    for (int i = 0; i < 5; i++) {
      WsResponse response = new WsResponse();
      for (int j = 0; j < 10; j++) {
        response.getContent().add(generateOneMbString());
      }
      float percentDone = (i + 1) * 20;
      response.setPercent(percentDone);
      template.convertAndSend("/topic/batch-test", response);
    }

  }

  private String generateOneMbString() {
    StringBuilder sb = new StringBuilder(CHARS_PER_MB);
    for (int j = 0; j < CHARS_PER_MB; j++) {
      sb.append('a');
    }
    return sb.toString();
  }
}
