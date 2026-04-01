package king.danta.fisa.service;

import king.danta.fisa.dto.TradeResponse;
import java.time.Instant;

public class TradeService {

    private long balance = 500_000_000;

    public TradeResponse buy(long price) {
        balance -= price;
        return new TradeResponse("SUCCESS", "BUY", price, balance, Instant.now());
    }

    public TradeResponse sell(long price) {
        balance += price;
        return new TradeResponse("SUCCESS", "SELL", price, balance, Instant.now());
    }
}