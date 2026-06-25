package com.bourbon_nook.users_api.utils;

import feign.FeignException;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class FeignErrorDecoder implements ErrorDecoder {
    private final Environment env;
    public FeignErrorDecoder(Environment env) {
        this.env = env;
    }

    @Override
    public Exception decode(String s, Response response) {
        switch (response.status()) {
            case 400:
                break;
            case 404:
                if(s.contains("getBottles")) {
                    return new ResponseStatusException(HttpStatus.valueOf(response.status()), env.getProperty("bottles.exceptions.bottles-not-found"));
                }
                break;
            default:
                return new Exception(response.reason());
        }
        return null;
    }
}
