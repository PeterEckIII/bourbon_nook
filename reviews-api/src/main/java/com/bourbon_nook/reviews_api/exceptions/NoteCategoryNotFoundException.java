package com.bourbon_nook.reviews_api.exceptions;

public class NoteCategoryNotFoundException extends RuntimeException {
    public NoteCategoryNotFoundException(String message) {
        super(message);
    }
}
