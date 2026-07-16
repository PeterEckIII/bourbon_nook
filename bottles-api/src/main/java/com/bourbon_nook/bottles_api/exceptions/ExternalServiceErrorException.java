package com.bourbon_nook.bottles_api.exceptions;

public class ExternalServiceErrorException extends RuntimeException {
    public ExternalServiceErrorException(String message) {
        super(message);
    }
}
