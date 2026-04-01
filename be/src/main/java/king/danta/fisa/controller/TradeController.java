package king.danta.fisa.controller;

import king.danta.fisa.dto.TradeErrorResponse;
import king.danta.fisa.dto.TradeResponse;
import king.danta.fisa.service.TradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trade")
public class TradeController {

    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService;
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buy() {
        // TODO : flux로 변경
        long stubPrice = 100_000_500L;
        try {
            TradeResponse response = tradeService.buy(stubPrice);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(new TradeErrorResponse("FAIL", e.getMessage()));
        }
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sell() {
        // TODO : flux로 변경
        long stubPrice = 100_000_000L;
        try {
            TradeResponse response = tradeService.sell(stubPrice);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .internalServerError()
                    .body(new TradeErrorResponse("FAIL", e.getMessage()));
        }
    }
}
