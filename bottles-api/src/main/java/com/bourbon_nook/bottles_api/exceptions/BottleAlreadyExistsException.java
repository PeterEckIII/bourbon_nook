package com.bourbon_nook.bottles_api.exceptions;

public class BottleAlreadyExistsException extends RuntimeException {
    public BottleAlreadyExistsException(String message) {
        super(message);
    }
}
