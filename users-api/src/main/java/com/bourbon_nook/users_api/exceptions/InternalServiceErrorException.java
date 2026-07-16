package com.bourbon_nook.users_api.exceptions;

public class InternalServiceErrorException extends RuntimeException {
    public InternalServiceErrorException(String message) {
        super(message);
    }
}
