package king.danta.fisa.dto;

import java.time.Instant;

public record TradeResponse(
        String status,
        String type,
        long price,
        long balance,
        Instant timestamp
) {}
