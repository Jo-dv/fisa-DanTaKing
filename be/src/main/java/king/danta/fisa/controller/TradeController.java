package king.danta.fisa.controller;

import king.danta.fisa.dto.TradeResponse;
import king.danta.fisa.service.TradeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TradeController {

    private final TradeService tradeService = new TradeService();

    @PostMapping("/trade/buy")
    public TradeResponse buy() {
        // TODO : flux로 변경
        long stubPrice = 30_400;
        return tradeService.buy(stubPrice);
    }

    @PostMapping("/trade/sell")
    public TradeResponse sell() {
        // TODO : flux로 변경
        long stubPrice = 30_500;
        return tradeService.sell(stubPrice);
    }
}
