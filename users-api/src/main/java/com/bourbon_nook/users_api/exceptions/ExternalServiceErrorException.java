package com.bourbon_nook.users_api.exceptions;

public class ExternalServiceErrorException extends RuntimeException {
    public ExternalServiceErrorException(String message) {
        super(message);
    }
}
