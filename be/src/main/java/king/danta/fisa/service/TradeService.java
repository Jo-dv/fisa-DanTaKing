package king.danta.fisa.service;

import king.danta.fisa.dto.TradeResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TradeService {

    private final AtomicLong balance = new AtomicLong(500_000_000);

    public TradeResponse buy(long price) {

        long current;

        do {
            current = balance.get();

            if (current < price) {
                throw new RuntimeException("잔액 부족으로 체결이 거절되었습니다.");
            }

        } while (!balance.compareAndSet(current, current - price));

        return new TradeResponse("SUCCESS", "BUY", price, balance.get(), Instant.now());
    }

    public TradeResponse sell(long price) {
        long updatedBalance = balance.addAndGet(price);
        return new TradeResponse("SUCCESS", "SELL", price, updatedBalance, Instant.now());
    }
}