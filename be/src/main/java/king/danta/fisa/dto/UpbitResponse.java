package king.danta.fisa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpbitResponse(
        @JsonProperty("trade_price")
        long tradePrice,
        @JsonProperty("timestamp")
        long timestamp
) {}
