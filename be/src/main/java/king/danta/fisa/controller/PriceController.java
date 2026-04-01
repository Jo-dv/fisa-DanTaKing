package king.danta.fisa.controller;

import king.danta.fisa.client.UpbitApiClient;
import king.danta.fisa.dto.UpbitResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PriceController {

    private final UpbitApiClient upbitApiClient;

    @GetMapping("/price/stream")
    public UpbitResponse getTickerData() {
        // 테스트
        UpbitResponse response = upbitApiClient.getTickerData();
        System.out.println("tradePrice: " + response.tradePrice());
        System.out.println("timestamp: " + response.timestamp());
        return response;
    }
}
