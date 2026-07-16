package com.bourbon_nook.bottles_api.exceptions;

public class InternalServiceErrorException extends RuntimeException {
    public InternalServiceErrorException(String message) {
        super(message);
    }
}
