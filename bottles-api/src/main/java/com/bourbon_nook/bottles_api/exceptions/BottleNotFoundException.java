package com.bourbon_nook.bottles_api.exceptions;

public class BottleNotFoundException extends RuntimeException {
    public BottleNotFoundException(String message) {
        super(message);
    }
}
