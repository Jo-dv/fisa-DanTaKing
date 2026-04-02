package king.danta.fisa.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import king.danta.fisa.dto.UpbitResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class UpbitApiClient {

    private final WebClient webClient;

    public UpbitApiClient(){
        this.webClient = WebClient.builder()
                .baseUrl("https://api.upbit.com")
                .build();
    }

    public Mono<UpbitResponse> getTickerData() {
        return webClient.get()
                .uri("/v1/ticker?markets=KRW-BTC")
                .retrieve()
                .bodyToFlux(UpbitResponse.class)
                .next();
    }
}
