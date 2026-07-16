package com.bourbon_nook.reviews_api.exceptions;

public class ExternalServiceErrorException extends RuntimeException {
    public ExternalServiceErrorException(String message) {
        super(message);
    }
}
