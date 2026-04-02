package king.danta.fisa.controller;

import king.danta.fisa.dto.PriceStreamResponse;
import king.danta.fisa.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequiredArgsConstructor
public class PriceController {

    private final PriceService priceService;


    @GetMapping(value = "/price/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<PriceStreamResponse>> priceSteram() {
        return priceService.stream()
                .map(data -> ServerSentEvent.<PriceStreamResponse>builder()
                        .event("price-quote")
                        .data(data)
                        .build());
    }

}
