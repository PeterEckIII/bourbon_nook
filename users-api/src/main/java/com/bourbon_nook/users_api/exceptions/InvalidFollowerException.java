package com.bourbon_nook.users_api.exceptions;

public class InvalidFollowerException extends RuntimeException {
    public InvalidFollowerException(String message) {
        super(message);
    }
}
