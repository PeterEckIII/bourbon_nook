package com.bourbon_nook.users_api.exceptions;

public class NotFollowingException extends RuntimeException {
    public NotFollowingException(String message) {
        super(message);
    }
}
