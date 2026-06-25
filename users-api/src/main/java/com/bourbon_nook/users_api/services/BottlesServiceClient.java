package com.bourbon_nook.users_api.services;

import com.bourbon_nook.users_api.models.responses.BottleResponseModel;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name="bottles-api")
public interface BottlesServiceClient {

    @GetMapping("/users/{id}/bottless")
    public List<BottleResponseModel> getBottles(@PathVariable String id);
}
