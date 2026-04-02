package king.danta.fisa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record UpbitResponse(
        @JsonProperty("trade_price")
        long tradePrice,
        @JsonProperty("change")
        String change,
        @JsonProperty("signed_change_price")
        long signedChangePrice,
        @JsonProperty("timestamp")
        long timestamp
){}
