package com.bourbon_nook.bottles_api.exceptions;

public class BottleAlreadyDeletedException extends RuntimeException {
    public BottleAlreadyDeletedException(String message) {
        super(message);
    }
}
