package com.bourbon_nook.bottles_api.exceptions;

public class DatabaseErrorException extends RuntimeException {
    public DatabaseErrorException(String message) {
        super(message);
    }
}
