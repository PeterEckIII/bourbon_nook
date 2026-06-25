package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.models.responses.BottleResponseModel;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

@FeignClient(name="bottles-api")
public interface BottlesServiceClient {

    @GetMapping("/users/{id}/bottles")
    @Retry(name="bottles-api")
    @CircuitBreaker(name="bottles-api", fallbackMethod="getBottlesFallback")
    List<BottleResponseModel> getBottles(@PathVariable String id);

    default List<BottleResponseModel> getBottlesFallback(String id, Throwable exception) {
        System.out.println("Param: " + id);
        System.out.println("Exception: " + exception);
        return new ArrayList<>();
    }
}
