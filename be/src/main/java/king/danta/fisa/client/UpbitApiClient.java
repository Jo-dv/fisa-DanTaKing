package king.danta.fisa.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import king.danta.fisa.dto.UpbitResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class UpbitApiClient {

    private final RestTemplate restTemplate;

    public UpbitApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public UpbitResponse getTickerData() {
        UpbitResponse[] response = restTemplate.getForObject(
                "https://api.upbit.com/v1/ticker?markets=KRW-BTC",
                UpbitResponse[].class
        );
        return response != null && response.length > 0 ? response[0] : null;
    }
}
