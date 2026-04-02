package king.danta.fisa.dto;

public record PriceStreamResponse(
        long price,
        String change,
        long changePrice,
        String timestamp
) { }
