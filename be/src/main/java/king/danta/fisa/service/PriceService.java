package king.danta.fisa.service;

import king.danta.fisa.client.UpbitApiClient;
import king.danta.fisa.dto.PriceStreamResponse;
import king.danta.fisa.dto.UpbitResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class PriceService {
    private final Flux<PriceStreamResponse> priceFlux;
    private final AtomicLong previousPrice = new AtomicLong(0);

    public PriceService(UpbitApiClient upbitApiClient){
        this.priceFlux = Flux.interval(Duration.ofMillis(500))
                .flatMap(tick -> upbitApiClient.getTickerData())
                .map(this::toResponse)
                .onBackpressureLatest()
                .replay(1)
                .autoConnect(0);
    }

    public Flux<PriceStreamResponse> stream() {
        return priceFlux;
    }

    public PriceStreamResponse toResponse(UpbitResponse upbit) {
        long current = upbit.tradePrice();
        long previous = previousPrice.getAndSet(current);

        long changePrice = current - previous;
        String change = changePrice >= 0 ? "RISE" : "FALL";

        return new PriceStreamResponse(
                current,
                change,
                changePrice,
                Instant.now().toString()
        );
    }
}
