package com.example.websockets;

import java.util.ArrayList;
import java.util.List;

public class WsResponse {
  private List<String> content = new ArrayList<>();
  private float percent;

  public List<String> getContent() {
    return content;
  }

  public void setContent(List<String> content) {
    this.content = content;
  }

  public float getPercent() {
    return percent;
  }

  public void setPercent(float percent) {
    this.percent = percent;
  }

}
