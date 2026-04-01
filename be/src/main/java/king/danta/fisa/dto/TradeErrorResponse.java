package king.danta.fisa.dto;

public record TradeErrorResponse(
        String status,
        String error
) {}